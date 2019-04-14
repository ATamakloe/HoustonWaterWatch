import * as fetch from 'isomorphic-fetch';



async function updateMonthlySiteData(siteid: string, collection: any): Promise<any> {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteid}&period=P30D&format=json&parameterCd=00065`;
  try {
    let last30Days = await fetch(url).then(data => data.json());
    last30Days = last30Days.value.timeSeries[0].values[0].value;
    collection.updateOne({ siteCode: `${siteid}` }, { $set: { lastmonthdata: last30Days } });
  } catch (err) { console.error(err) }
};

async function updateCurrentWaterLevel(siteid: string, collection: any): Promise<any> {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteid}&parameterCd=00065&format=json`;
  let currentWaterLevel: any;
  try {
    currentWaterLevel = await fetch(url).then(data => data.json());
    currentWaterLevel = currentWaterLevel.value.timeSeries[0].values[0].value[0].value;
    collection.updateOne({ siteCode: `${siteid}` }, { $set: { WaterLevel: currentWaterLevel } });

  }
  catch (err) {
    console.error(err);
  }

};




export { updateMonthlySiteData, updateCurrentWaterLevel };
