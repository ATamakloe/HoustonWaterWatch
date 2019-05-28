"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var siteSchema = new mongoose.Schema({
    _id: String,
    siteCode: String,
    sitename: String,
    location: Object,
    floodStage: Object,
    lastmonthdata: Array,
    todaysaverage: Object,
    WaterLevel: String,
    subscribers: Array
});
var siteModel = mongoose.model("site", siteSchema, "sites");
exports["default"] = siteModel;
