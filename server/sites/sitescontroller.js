"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var middleware_1 = require("../helpers/middleware");
var smshelpers_1 = require("../helpers/smshelpers");
var node_fetch_1 = require("node-fetch");
var SitesController = /** @class */ (function () {
    function SitesController(collection) {
        var _this = this;
        this.router = express.Router();
        this.updateMonthlySiteData = function () { return __awaiter(_this, void 0, void 0, function () {
            var siteCodeArray, url, siteDataArray;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection
                            .find()
                            .then(function (sites) {
                            return sites.map(function (site) { return site.siteCode; });
                        })];
                    case 1:
                        siteCodeArray = _a.sent();
                        url = "https://waterservices.usgs.gov/nwis/iv/?sites=" + siteCodeArray.join(",") + "&period=P30D&format=json&parameterCd=00065";
                        return [4 /*yield*/, node_fetch_1["default"](url, {})
                                .then(function (data) { return data.json(); })
                                .then(function (data) { return data.value.timeSeries; })];
                    case 2:
                        siteDataArray = _a.sent();
                        siteDataArray.forEach(function (data) {
                            _this.collection.updateOne({ siteCode: "" + data.sourceInfo.siteCode["0"].value }, { $set: { lastmonthdata: data.values[0].value } });
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        this.updateCurrentWaterLevel = function () { return __awaiter(_this, void 0, void 0, function () {
            var siteCodeArray, url, newWaterLevel, siteDataArray;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection
                            .find()
                            .then(function (sites) {
                            return sites.map(function (site) { return site.siteCode; });
                        })];
                    case 1:
                        siteCodeArray = _a.sent();
                        url = "https://waterservices.usgs.gov/nwis/iv/?sites=" + siteCodeArray.join(",") + "&parameterCd=00065&period=PT45M&format=json";
                        return [4 /*yield*/, node_fetch_1["default"](url, {})
                                .then(function (data) { return data.json(); })
                                .then(function (data) { return data.value.timeSeries; })];
                    case 2:
                        siteDataArray = _a.sent();
                        //If there are new values, update DB with values
                        siteDataArray.forEach(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (data.values[0].value.length > 0) {
                                    newWaterLevel = data.values[0].value.pop().value;
                                    this.collection.updateOne({ siteCode: "" + data.sourceInfo.siteCode[0].value }, { $set: { WaterLevel: newWaterLevel } });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); };
        this.getAllSites = function (
        /**
         * @name getAllSites
         * @function
         * @param {express.Request} request - Express request object
         * @param {express.Response} response - Express response object
         * Fetches every site from site collection, returns all to client
         */
        request, response) { return __awaiter(_this, void 0, void 0, function () {
            var results, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({}).toArray()];
                    case 1:
                        results = _a.sent();
                        results = results.map(function (site) { return ({
                            siteCode: site.siteCode,
                            siteName: site.sitename,
                            location: site.location,
                            waterLevel: site.WaterLevel,
                            floodStage: site.floodStage,
                            floodStatus: site.floodStage.caution === "N/A"
                                ? "N/A"
                                : parseFloat(site.WaterLevel) < parseFloat(site.floodStage.caution)
                                    ? "Normal"
                                    : parseFloat(site.WaterLevel) < parseFloat(site.floodStage.flood) &&
                                        parseFloat(site.WaterLevel) >= parseFloat(site.floodStage.caution)
                                        ? "Caution"
                                        : "Flooding"
                        }); });
                        response
                            .type("json")
                            .status(200)
                            .send(results);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        response
                            .status(500)
                            .send("Water watch is Unavailable, try again shortly");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getSite = function (request, response) {
            /**
             * @name getSite
             * @function
             * @param {express.Request} request - Express request object
             * @param {express.Response} response - Express response object
             * Returns a single site from the DB specified by request.params.id
             */
            var id = request.params.id;
            _this.collection.findById(id).then(function (site) {
                response.send({
                    siteCode: site.siteCode,
                    siteName: site.sitename,
                    lastMonthData: site.lastmonthdata,
                    floodStage: site.floodStage,
                    waterLevel: site.WaterLevel,
                    floodStatus: site.floodStage.caution === "N/A"
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
        this.getWeather = function (
        /**
         * @name getWeather
         * @function
         * @param {express.Request} request - Express request object
         * @param {express.Response} response - Express response object
         * Fetches weather data from darkSkyAPI (https://darksky.net/dev/docs) and sends back to client
         */
        request, response) { return __awaiter(_this, void 0, void 0, function () {
            var APIKEYWEATHER, weatherAPIURL;
            return __generator(this, function (_a) {
                APIKEYWEATHER = process.env.API_KEY_WEATHER;
                weatherAPIURL = "https://api.darksky.net/forecast/" + APIKEYWEATHER + "/29.7604,-95.3698";
                node_fetch_1["default"](weatherAPIURL, {})
                    .then(function (data) { return data.json(); })
                    .then(function (data) { return data.currently; })
                    .then(function (data) {
                    response
                        .type("json")
                        .status(200)
                        .send(data);
                })["catch"](function () {
                    response.status(500).send("Weather Unavailable");
                });
                return [2 /*return*/];
            });
        }); };
        this.subscribeToAlerts = function (request, response) {
            /**
             * @name subscribeToAlerts
             * @function
             * @param {express.Request} request - Express request object
             * @param {express.Response} response - Express response object
             * Takes a phone number and list of sites supplied by the client via request object
             * and adds the phone number to the "subscribers" array of each site.
             */
            var phoneNumber = request.body.phoneNumber;
            var validSites = request.body.validSites;
            request
                .checkBody("phoneNumber")
                .isNumeric()
                .isLength({ min: 10, max: 11 });
            var errors = request.validationErrors();
            if (errors) {
                response.status(500).send("Phone number invalid");
            }
            else {
                try {
                    var listOfSubscribers_1;
                    validSites.forEach(function (site) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            listOfSubscribers_1 = this.collection.findOne({ siteCode: "" + site }, { subscribers: 1 });
                            //If phone number is already subscribed to this site, don't do anything. If it isn't, add to subscribers list
                            !listOfSubscribers_1.subscribers.includes(phoneNumber) &&
                                this.collection.updateOne({ siteCode: "" + site }, { $push: { subscribers: "" + phoneNumber } });
                            return [2 /*return*/];
                        });
                    }); });
                    smshelpers_1.sendSignUpText();
                    response.status(200).send("Successful");
                }
                catch (err) {
                    response.status(500).send("Failed to subscribe to alert");
                }
            }
        };
        this.initializeRoutes();
        this.collection = collection;
    }
    SitesController.prototype.initializeRoutes = function () {
        /**
         * @name initializeRoutes
         * @function
         * @params None
         * Initializes paths for Express.Router
         */
        this.router.get("/watersites", middleware_1.cache(20), this.getAllSites);
        this.router.get("/sites/:id", middleware_1.cache(20), this.getSite);
        this.router.get("/weatherdata", middleware_1.cache(15), this.getWeather);
        this.router.post("subscribe", this.subscribeToAlerts);
        //Move this to a different controller when you build out routes for user auth
    };
    return SitesController;
}());
exports["default"] = SitesController;
