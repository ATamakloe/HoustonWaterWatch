import * as mongoose from "mongoose";
import Site from "../interfaces/siteinterface";

const siteSchema = new mongoose.Schema({
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

const siteModel = mongoose.model<Site & mongoose.Document>(
  "site",
  siteSchema,
  "sites"
);

export default siteModel;
