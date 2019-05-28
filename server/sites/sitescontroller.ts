import * as express from "express";
import { cache } from "../helpers/middleware";
import Site from "../interfaces/siteinterface";
import Controller from "../interfaces/controllerinterface";
import { sendSignUpText } from "../helpers/smshelpers";
import {
  updateCurrentWaterLevel,
  updateMonthlySiteData
} from "../helpers/helpers";
import fetch from "node-fetch";

class SitesController implements Controller {
  public router = express.Router();
  public collection: any;
  constructor(collection) {
    this.initializeRoutes();
    this.collection = collection;
    this.updateData();
  }

  private updateData(interval: number = 30) {
    /**
     * @name updateData
     * @function
     * @params Update frequency in minutes
     * Calls helper methods to update DB values
     */

    updateCurrentWaterLevel(this.collection);
    updateMonthlySiteData(this.collection);

    setInterval(() => {
      updateCurrentWaterLevel(this.collection);
      updateMonthlySiteData(this.collection);
    }, interval * 60 * 1000);
  }

  private initializeRoutes() {
    /**
     * @name initializeRoutes
     * @function
     * @params None
     * Initializes paths for Express.Router
     */
    this.router.get("/watersites", cache(20), this.getAllSites);

    this.router.get("/sites/:id", cache(20), this.getSite);

    this.router.get("/weatherdata", cache(15), this.getWeather);

    this.router.post("subscribe", this.subscribeToAlerts);
    //Move this to a different controller when you build out routes for user auth
  }

  private getAllSites = async (
    /**
     * @name getAllSites
     * @function
     * @param {express.Request} request - Express request object
     * @param {express.Response} response - Express response object
     * Fetches every site from site collection, returns all to client
     */
    request: express.Request,
    response: express.Response
  ) => {
    try {
      let results: Array<any> = await this.collection.find({}).toArray();
      results = results.map((site: Site) => ({
        siteCode: site.siteCode,
        siteName: site.sitename,
        location: site.location,
        waterLevel: site.WaterLevel,
        floodStage: site.floodStage,
        floodStatus:
          site.floodStage.caution === "N/A"
            ? "N/A"
            : parseFloat(site.WaterLevel) < parseFloat(site.floodStage.caution)
            ? "Normal"
            : parseFloat(site.WaterLevel) < parseFloat(site.floodStage.flood) &&
              parseFloat(site.WaterLevel) >= parseFloat(site.floodStage.caution)
            ? "Caution"
            : "Flooding"
      }));
      response
        .type("json")
        .status(200)
        .send(results);
    } catch (err) {
      console.log(err);
      response
        .status(500)
        .send("Water watch is Unavailable, try again shortly");
    }
  };

  private getSite = (request: express.Request, response: express.Response) => {
    /**
     * @name getSite
     * @function
     * @param {express.Request} request - Express request object
     * @param {express.Response} response - Express response object
     * Returns a single site from the DB specified by request.params.id
     */
    const id = request.params.id;
    this.collection.findById(id).then((site: Site) => {
      response.send({
        siteCode: site.siteCode,
        siteName: site.sitename,
        lastMonthData: site.lastmonthdata,
        floodStage: site.floodStage,
        waterLevel: site.WaterLevel,
        floodStatus:
          site.floodStage.caution === "N/A"
            ? "N/A"
            : parseFloat(site.WaterLevel) < parseFloat(site.floodStage.caution)
            ? "Normal"
            : parseFloat(site.WaterLevel) < parseFloat(site.floodStage.flood) &&
              parseFloat(site.WaterLevel) >= parseFloat(site.floodStage.caution)
            ? "Caution"
            : "Flooding"
      });
    });
  };

  private getWeather = async (
    /**
     * @name getWeather
     * @function
     * @param {express.Request} request - Express request object
     * @param {express.Response} response - Express response object
     * Fetches weather data from darkSkyAPI (https://darksky.net/dev/docs) and sends back to client
     */
    request: express.Request,
    response: express.Response
  ) => {
    const APIKEYWEATHER = process.env.API_KEY_WEATHER;
    const weatherAPIURL = `https://api.darksky.net/forecast/${APIKEYWEATHER}/29.7604,-95.3698`;
    fetch(weatherAPIURL, {})
      .then(data => data.json())
      .then(data => data.currently)
      .then(data => {
        response
          .type("json")
          .status(200)
          .send(data);
      })
      .catch(() => {
        response.status(500).send("Weather Unavailable");
      });
  };

  private subscribeToAlerts = (
    request: express.Request,
    response: express.Response
  ) => {
    /**
     * @name subscribeToAlerts
     * @function
     * @param {express.Request} request - Express request object
     * @param {express.Response} response - Express response object
     * Takes a phone number and list of sites supplied by the client via request object
     * and adds the phone number to the "subscribers" array of each site.
     */
    const phoneNumber: string = request.body.phoneNumber;
    const validSites: Array<string> = request.body.validSites;
    request
      .checkBody("phoneNumber")
      .isNumeric()
      .isLength({ min: 10, max: 11 });

    const errors: any = request.validationErrors();

    if (errors) {
      response.status(500).send("Phone number invalid");
    } else {
      try {
        let listOfSubscribers: any;
        validSites.forEach(async (site: string) => {
          listOfSubscribers = this.collection.findOne(
            { siteCode: `${site}` },
            { subscribers: 1 }
          );
          //If phone number is already subscribed to this site, don't do anything. If it isn't, add to subscribers list
          !listOfSubscribers.subscribers.includes(phoneNumber) &&
            this.collection.updateOne(
              { siteCode: `${site}` },
              { $push: { subscribers: `${phoneNumber}` } }
            );
        });
        sendSignUpText();
        response.status(200).send("Successful");
      } catch (err) {
        response.status(500).send("Failed to subscribe to alert");
      }
    }
  };
}

export default SitesController;
