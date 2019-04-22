import * as fetch from 'isomorphic-fetch';



async function updateMonthlySiteData(siteCodeArray: Array<string>, collection: any): Promise<any> {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteCodeArray.join(',')}&period=P30D&format=json&parameterCd=00065`;
  let siteDataArray: Array<any>;
  try {
    siteDataArray = await fetch(url).then(data => data.json()).then(data => data.value.timeSeries);
    siteDataArray.forEach(site => {
      collection.updateOne({ siteCode: `${site.sourceInfo.siteCode["0"].value}` }, { $set: { lastmonthdata: site.values[0].value } });
    })
  } catch (err) { console.error(err) }
};

async function updateCurrentWaterLevel(siteCodeArray: Array<string>, collection: any): Promise<any> {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteCodeArray.join(',')}&parameterCd=00065&period=PT45M&format=json`;
  let siteDataArray: Array<any>;
  try {
    siteDataArray = await fetch(url).then(data => data.json()).then(data => data.value.timeSeries);
    siteDataArray.forEach(site => {
      collection.updateOne({ siteCode: `${site.sourceInfo.siteCode["0"].value}` }, { $set: { WaterLevel: site.values[0].value.pop().value } });
    })
  }
  catch (err) {
    console.error(err);
  }

};




export { updateMonthlySiteData, updateCurrentWaterLevel };
