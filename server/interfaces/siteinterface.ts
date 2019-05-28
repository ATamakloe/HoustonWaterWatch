interface Site {
  _id: string;
  siteCode: string;
  sitename: string;
  location: object;
  floodStage: any;
  lastmonthdata: Array<object>;
  todaysaverage: object;
  WaterLevel: string;
  subscribers: Array<string>;
}
export default Site;
