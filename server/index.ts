import * as express from 'express';
import * as cron from 'node-cron';
import * as path from 'path';
import { updateMonthlySiteData, updateCurrentWaterLevel } from './helpers/helpers';
import { cache } from './helpers/middleware';
import { sendAlert, sendSignUpText } from './helpers/smshelpers';
import * as expressValidator from 'express-validator';
import dbClient from './helpers/dbclient';
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3001;

let collection: any;
let siteCodeArray: Array<any>;

app.use(expressValidator())
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.listen(port, async () => {
  //Using a dbClient obj instead of storing the db collection in req.app.locals because functions need to access
  //the collection outside of an express route.
  collection = await dbClient.connect();
  collection.find().toArray((err: Error, sites: Array<any>) => {
    if (err) return err;
    siteCodeArray = sites.map(site => site.siteCode);
    console.log(`Live on port ${port}`)
  })
});

app.get('/sites/:id', cache(10), async (req: express.Request, res: express.Response) => {
  try {
    let results: any = await collection.findOne({ _id: req.params.id });
    let site = {
      siteCode: results.siteCode,
      siteName: results.sitename,
      lastMonthData: results.lastmonthdata,
      floodStage: results.floodStage,
      waterLevel: results.WaterLevel
    }
    res.type('json').status(200).send(site);
  } catch (err) {
    res.status(500).send("Cannot retrieve data for this site")
  }
});

app.get('/chartdata', cache(10), async (req: express.Request, res: express.Response) => {
  try {
    let results: Array<any> = await collection.find().toArray();
    results = results.map(site => (
      {
        siteCode: site.siteCode,
        siteName: site.sitename,
        location: site.location,
        waterLevel: site.WaterLevel,
        floodStage: site.floodStage,
        floodStatus: site.floodStage.caution === "N/A" ? "N/A" : site.WaterLevel >= site.floodStage.caution ?
          (site.WaterLevel >= site.floodStage.flood ? "Flooding" : "Caution") :
          "Normal",
      }
    )
    );
    res.type('json').status(200).send(results);
  } catch (err) {
    res.status(500).send("Water watch is Unavailable, try again shortly")
  }
});

app.get('/weatherdata', cache(10), async (req: express.Request, res: express.Response) => {
  const APIKEYWEATHER = process.env.API_KEY_WEATHER;
  const weatherAPIURL = `https://api.darksky.net/forecast/${APIKEYWEATHER}/29.7604,-95.3698`;
  try {
    let weatherData = await fetch(weatherAPIURL).then(data => data.json()).then(data => data.currently);
    res.type('json').status(200).send(weatherData);
  } catch (err) {
    res.status(500).send("Weather Unavailable");
  }
});

app.post('/subscribe', (req: express.Request, res: express.Response) => {
  const phoneNumber: string = req.body.phoneNumber;
  const validSites: Array<string> = req.body.validSites;
  req.checkBody('phoneNumber').isNumeric().isLength({ min: 10, max: 11 })

  var errors = req.validationErrors();

  if (errors) {
    res.status(500).send("Phone number invalid")
  } else {
    try {
      let listOfSubscribers: any;
      validSites.forEach(async site => {
        listOfSubscribers = await collection.findOne({ siteCode: `${site}` }, { subscribers: 1 });
        //If phone number is already subscribed, don't do anything. If it isn't, add to subscribers list
        //This is to prevent duplicated subscriptions for alert so subscribers don't get multiple alert messages for the same site
        !listOfSubscribers.subscribers.includes(phoneNumber) && collection.updateOne({ siteCode: `${site}` }, { $push: { subscribers: `${phoneNumber}` } })
      }
      )
      sendSignUpText()
      res.status(200).send("Successful")
    } catch (err) {
      res.status(500).send("Failed to subscribe to alert")
    }

  }
});

const CronTimes = {
  DailyUpdateTime: '00 30 00 * * *',
  //Every day at 12:30AM
  WaterLevelUpdateTimer: '* 20 * * * *',
  //Every 15 minutes
  FloodAlertTimer: '* 10 * * * *'
  //Every 10 minutes
};

cron.schedule(CronTimes.DailyUpdateTime, () => {
  //This makes sure the data in DB is fresh
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    console.log("Updating monthly water level");
    siteCodeArray.forEach(siteCode => {
      updateMonthlySiteData(siteCode, collection);
    });
  }
}
);

cron.schedule(CronTimes.WaterLevelUpdateTimer, () => {
  //This updates the currentWaterLevel for each site every 15 mins.
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    console.log("Updating water level");
    siteCodeArray.forEach(siteCode => updateCurrentWaterLevel(siteCode, collection));
  }
});


cron.schedule(CronTimes.FloodAlertTimer, () => {
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    siteCodeArray.forEach(async siteCode => {
      let results = await collection.findOne({ siteCode: `${siteCode}` }, { WaterLevel: 1, floodStage: 1, siteName: 1, subscribers: 1 });
      (results.waterLevel >= results.floodStage.caution) && sendAlert(results.siteName)
    })
  }
})
