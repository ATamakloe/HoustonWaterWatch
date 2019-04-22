import * as express from 'express';
import * as cron from 'node-cron';
import * as path from 'path';
import * as expressValidator from 'express-validator';
import { updateMonthlySiteData, updateCurrentWaterLevel } from './helpers/helpers';
import { cache } from './helpers/middleware';
import { sendAlert, sendSignUpText } from './helpers/smshelpers';
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
  console.log("Reaching for the connection")
  collection = await dbClient.connect();
  console.log(`Connection established ${collection}`)
  collection.find().toArray((err: Error, sites: Array<any>) => {
    if (err) console.log(err);
    siteCodeArray = sites.map(site =>
      site.siteCode
    );
    console.log(siteCodeArray);
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

app.get('/chartdata', cache(30), async (req: express.Request, res: express.Response) => {
  try {
    let results: Array<any> = await collection.find().toArray();
    results = results.map(site => (
      {
        siteCode: site.siteCode,
        siteName: site.sitename,
        location: site.location,
        waterLevel: site.WaterLevel,
        floodStage: site.floodStage,
        floodStatus: site.floodStage.caution === "N/A" ? "N/A" :
        //If there's no flood stage, set floodstatus to N/A
        site.WaterLevel >= site.floodStage.caution ?
        /*If there is a floodstage, check if the water level is above "Caution"
        If it is above caution, check if it's above "Flooding", if not set floodstatus to "Normal"
        if it is, set flood status to flooding, if not set flood status to caution */
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

app.get('/weatherdata', cache(20), async (req: any, res: any) => {
  const APIKEYWEATHER = process.env.API_KEY_WEATHER;
  const weatherAPIURL = `https://api.darksky.net/forecast/${APIKEYWEATHER}/29.7604,-95.3698`;
  try {
    let weatherData = await fetch(weatherAPIURL).then(data => data.json()).then(data => data.currently);
    res.type('json').status(200).send(weatherData);
  } catch (err) {
    res.status(500).send("Weather Unavailable");
  }
});

app.post('/subscribe', (req: any, res: any) => {
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
        //If phone number is already subscribed to this site, don't do anything. If it isn't, add to subscribers list
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
  update30DayTimer: '00 30 00 * * *',
  //Every day at 12:30AM
  WaterLevelUpdateTimer: '*/45 * * * *',
  //Every 45 minutes
  FloodAlertTimer: '*/60 * * * *'
  //Every 45 minutes
};



const update30DayData = cron.schedule(CronTimes.update30DayTimer, () => {
  //This makes sure the data in DB is fresh
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    updateMonthlySiteData(siteCodeArray, collection);
  }
});

const updateWaterLevel = cron.schedule(CronTimes.WaterLevelUpdateTimer, () => {
  //This updates the currentWaterLevel for each site
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    updateCurrentWaterLevel(siteCodeArray, collection);
  }
});

const issueFloodAlert = cron.schedule(CronTimes.FloodAlertTimer, () => {
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    siteCodeArray.forEach(async siteCode => {
      let results = await collection.findOne({ siteCode: `${siteCode}` }, { WaterLevel: 1, floodStage: 1, siteName: 1, subscribers: 1 });
      (results.waterLevel >= results.floodStage.caution) && sendAlert(results.siteName)
    })
  }
})


update30DayData.start();
updateWaterLevel.start();
issueFloodAlert.start();
