import "dotenv/config";
import App from "./app";
import dbInstance from "../server/helpers/dbWrapper";
import SitesController from "./sites/sitescontroller";
import validateEnv from "./helpers/validateEnv";
import {
  updateCurrentWaterLevel,
  updateMonthlySiteData
} from "./helpers/helpers";

(async () => {
  validateEnv();
  let collection = await dbInstance.connect();
  let app = await new App([new SitesController(collection)]);
  updateCurrentWaterLevel(collection);
  updateMonthlySiteData(collection);
  app.listen();
})();

/*
import * as express from "express";
import * as cron from "node-cron";
import * as path from "path";

const app = express();
const port = process.env.PORT || 3001;

let collection: any;
let siteCodeArray: Array<any>;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

app.listen(port, async () => {
  collection = await dbInstance.connect();
  collection.find().toArray((err: Error, sites: Array<any>) => {
    if (err) console.log(err);
    siteCodeArray = sites.map(site => site.siteCode);
    console.log(`Live on port ${port}`);
    updateCurrentWaterLevel(siteCodeArray, collection);
    updateMonthlySiteData(siteCodeArray, collection);
  });
});

/*
const CronTimes = {

  update30DayTimer: "00 30 00 * * *",
  //Every day at 12:30AM
  WaterLevelUpdateTimer: /"*/
//45 * * * *",
//Every 45 minutes

//FloodAlertTimer: "*/60 * * * *"
//Every 60 minutes
/*

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
      let results = await collection.findOne(
        { siteCode: `${siteCode}` },
        { WaterLevel: 1, floodStage: 1, siteName: 1, subscribers: 1 }
      );
      results.waterLevel >= results.floodStage.caution &&
        sendAlert(results.siteName);
    });
  }
});

update30DayData.start();
updateWaterLevel.start();
issueFloodAlert.start();
*/
