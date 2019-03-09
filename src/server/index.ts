import * as express from 'express';
import * as cron from 'node-cron';
import { updateMonthlySiteData, updateDailyAverage, updateCurrentWaterLevel } from './helpers/helpers';
import dbClient from './helpers/dbclient';

const app = express();
const port = process.env.PORT || 8888;

let collection: any;
let siteCodeArray: Array<any>;


app.use(express.urlencoded({ extended: true }));

app.listen(port, async () => {
  //Using a dbClient obj instead of storing the db collection in req.app.locals because functions need to access
  //the collection outside of an express route.
  collection = await dbClient.connect();
  collection.find().toArray((err, sites) => {
    if (err) return err;
    siteCodeArray = sites.map(site => site.siteCode);
    console.log(`Live on port ${port}`)
  })
});

app.get('/sites/:id', async (req: any, res: any) => {
  try {
    let results: any = await collection.findOne({ _id: req.params.id });
    let site = {
      siteCode: results.siteCode,
      siteName: results.sitename,
      lastMonthData: results.lastmonthdata,
      floodStage: results.floodStage,
      todaysAverage: results.todaysaverage.Value,
      waterLevel: results.WaterLevel
    }
    res.status(200).send(site);
  } catch (err) {
    res.status(500).send("Internal Server Error")
  }
});

app.get('/chartdata', async (req: any, res: any) => {
  try {
    let results:Array<any> = await collection.find().toArray();
    results = results.map(site => (
      {
        siteCode: site.siteCode,
        siteName: site.sitename,
        location: site.location,
        waterLevel: site.WaterLevel,
        floodStage: site.floodStage,
        floodStatus: site.floodStage.caution === "N/A" ? "N/A" : Number(site.WaterLevel) >= Number(site.floodStage.caution) ?
          (Number(site.WaterLevel) >= Number(site.floodStage.flood) ? "Flooding" : "Caution") :
          "Normal"
      }
    )
    );
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send("Internal Server Error")
  }
});

const CronTimes = {
  DailyUpdateTime: '00 30 00 * * *',
  //Every day at 12:30AM
  WaterLevelUpdateTimer: '15 * * * *'
  //Every 15 minutes
};

cron.schedule(CronTimes.DailyUpdateTime, () => {
  //Check to make sure connection to DB exists before running
  //This cron job updates the 30 day data and annual daily average for each site daily at 12:30AM
  //There's a better way to write this, refactor soon
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    siteCodeArray.forEach(siteCode => {
      updateMonthlySiteData(siteCode, collection);
      updateDailyAverage(siteCode, collection);
    });

  } else {
    setTimeout((collection: any) => {
      siteCodeArray.forEach(siteCode => {
        updateMonthlySiteData(siteCode, collection);
        updateDailyAverage(siteCode, collection);
      });
    }, 5000)
  }
});

cron.schedule(CronTimes.WaterLevelUpdateTimer, () => {
  //This cron job updates the currentWaterLevel for each site every 15 mins.
  if (typeof collection !== undefined && typeof siteCodeArray !== undefined) {
    siteCodeArray.forEach(siteCode => updateCurrentWaterLevel(siteCode, collection));
  } else {
    setTimeout((collection: any) => {
      siteCodeArray.forEach(siteCode => updateCurrentWaterLevel(siteCode, collection));
    }, 5000)
  }
});
