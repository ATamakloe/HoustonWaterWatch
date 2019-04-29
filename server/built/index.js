var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as express from 'express';
import * as cron from 'node-cron';
import * as path from 'path';
import * as expressValidator from 'express-validator';
import { updateMonthlySiteData, updateCurrentWaterLevel } from './helpers/helpers';
import { cache } from './helpers/middleware';
import { sendAlert, sendSignUpText } from './helpers/smshelpers';
import dbInstance from './helpers/dbWrapper';
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;
let collection;
let siteCodeArray;
app.use(expressValidator());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.listen(port, () => __awaiter(this, void 0, void 0, function* () {
    collection = yield dbInstance.connect();
    collection.find().toArray((err, sites) => {
        if (err)
            console.log(err);
        siteCodeArray = sites.map(site => site.siteCode);
        console.log(`Live on port ${port}`);
    });
}));
app.get('/sites/:id', cache(10), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let results = yield collection.findOne({ _id: req.params.id });
        let site = {
            siteCode: results.siteCode,
            siteName: results.sitename,
            lastMonthData: results.lastmonthdata,
            floodStage: results.floodStage,
            waterLevel: results.WaterLevel
        };
        res.type('json').status(200).send(site);
    }
    catch (err) {
        res.status(500).send("Cannot retrieve data for this site");
    }
}));
app.get('/chartdata', cache(30), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let results = yield collection.find({}).toArray();
        results = results.map(site => ({
            siteCode: site.siteCode,
            siteName: site.sitename,
            location: site.location,
            waterLevel: site.WaterLevel,
            floodStage: site.floodStage,
            floodStatus: (site.floodStage.caution === "N/A" ? "N/A" :
                parseFloat(site.WaterLevel) < parseFloat(site.floodStage.caution) ? "Normal" :
                    (parseFloat(site.WaterLevel) < parseFloat(site.floodStage.flood) && parseFloat(site.WaterLevel) >= parseFloat(site.floodStage.caution) ? "Caution" :
                        "Flooding"))
        }));
        res.type('json').status(200).send(results);
    }
    catch (err) {
        res.status(500).send("Water watch is Unavailable, try again shortly");
    }
}));
app.get('/weatherdata', cache(20), (req, res) => __awaiter(this, void 0, void 0, function* () {
    const APIKEYWEATHER = process.env.API_KEY_WEATHER;
    const weatherAPIURL = `https://api.darksky.net/forecast/${APIKEYWEATHER}/29.7604,-95.3698`;
    try {
        let weatherData = yield fetch(weatherAPIURL).then(data => data.json()).then(data => data.currently);
        res.type('json').status(200).send(weatherData);
    }
    catch (err) {
        res.status(500).send("Weather Unavailable");
    }
}));
app.post('/subscribe', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const validSites = req.body.validSites;
    req.checkBody('phoneNumber').isNumeric().isLength({ min: 10, max: 11 });
    var errors = req.validationErrors();
    if (errors) {
        res.status(500).send("Phone number invalid");
    }
    else {
        try {
            let listOfSubscribers;
            validSites.forEach((site) => __awaiter(this, void 0, void 0, function* () {
                listOfSubscribers = yield collection.findOne({ siteCode: `${site}` }, { subscribers: 1 });
                //If phone number is already subscribed to this site, don't do anything. If it isn't, add to subscribers list
                !listOfSubscribers.subscribers.includes(phoneNumber) && collection.updateOne({ siteCode: `${site}` }, { $push: { subscribers: `${phoneNumber}` } });
            }));
            sendSignUpText();
            res.status(200).send("Successful");
        }
        catch (err) {
            res.status(500).send("Failed to subscribe to alert");
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
        siteCodeArray.forEach((siteCode) => __awaiter(this, void 0, void 0, function* () {
            let results = yield collection.findOne({ siteCode: `${siteCode}` }, { WaterLevel: 1, floodStage: 1, siteName: 1, subscribers: 1 });
            (results.waterLevel >= results.floodStage.caution) && sendAlert(results.siteName);
        }));
    }
});
update30DayData.start();
updateWaterLevel.start();
issueFloodAlert.start();
