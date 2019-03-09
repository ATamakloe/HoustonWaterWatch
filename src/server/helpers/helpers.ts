import * as fs from 'fs';
import * as fetch from 'isomorphic-fetch';
import * as path from 'path';
const pathToCSVs = path.join(__dirname, '../','/waterdatacsv');

function CurrentDaySinceNewYear(): number {
  //UpdateDailYAverage uses this
  const today: any = new Date();
  const Jan1ThisYear: any = new Date(today.getFullYear(), 0, 1)
  const DaysSinceNewYear: number = Math.ceil((today - Jan1ThisYear) / 86400000);
  return DaysSinceNewYear;
}

function arraySearch(arr:Array<string>, regX:string): number {
  //This might be useful client side
  // Searches an array for a regX and returns the index
  for (let i:number = 0; i <= arr.length; i += 1) {
    if (arr[i].toString().match(regX)) {
      return i;
    }
  }
  return -1;
}

function fileWrite(data:any, filepath:string, filename:string): number {
  fs.writeFile(`${filepath}/${filename}`, data, (err) => {
    if (err) {
      console.error(err);
      return -1
    };
    console.log(`Wrote to file ${filename}`);
  });
  return 1
};

function getWaterDataTXT(siteNumber:string = '08068500', filepath:string):void {
  //This was used to get initial files that supply data for each site's daily average. Used by UpdateDailyAverage
  //May not be used again, but keeping here just in case
  const url = `https://waterservices.usgs.gov/nwis/stat/?format=rdb&sites=${siteNumber}&statReportType=daily&statTypeCd=mean&parameterCd=00065`;
  try {
  fetch(url)
    .then(data  => data.text())
    .then(data => fileWrite(data, filepath, `${siteNumber}.txt`));
  } catch (err) {
    console.error(err);
  }
};


async function updateMonthlySiteData(siteid: string, collection:any):Promise<any> {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteid}&period=P30D&format=json&parameterCd=00065`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    data = data.value.timeSeries[0].values[0].value;
    collection.updateOne({ siteCode: `${siteid}` }, { $set: { lastmonthdata: data } });
  }  catch (err) { console.error(err) }
};

//Turn siteID and collection into an interface;

async function updateCurrentWaterLevel(siteid: string, collection:any):Promise<any> {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteid}&parameterCd=00065&format=json`;
  let currentWaterLevel;
  try {
    console.log("Updating water level");
    currentWaterLevel = await fetch(url);
    currentWaterLevel = await currentWaterLevel.json();
    currentWaterLevel = currentWaterLevel.value.timeSeries[0].values[0].value[0].value;
    collection.updateOne({ siteCode: `${siteid}` }, { $set: { WaterLevel: currentWaterLevel } });

  }
  catch (err) {
    console.error(err);
  }

};

function updateDailyAverage(siteid:string, collection:any, config:any = { emptyFileIndicator: '# //Output-Format: RDB', checkForSecondSite: 21, firstSamplingSiteLine: 36, secondSamplingSiteLine: 403 }):void {
  let lineArr:Array<string> = [];
  let results:any ;
  fs.readFile(`${pathToCSVs}/${siteid}.txt`, 'utf8', (err, data):void => {
    if (err) throw err;
    data.toString().split('\n').forEach(line => lineArr.push(line));
    if (lineArr[0] === config.emptyFileIndicator) {
      results = {
        MonthAndDay: `N/A`,
        Value: `N/A`,
      };
    } else {
      results = lineArr[config.checkForSecondSite] === '#' ? lineArr[config.firstSamplingSiteLine + CurrentDaySinceNewYear()].split('\t') : lineArr[config.secondSamplingSiteLine + CurrentDaySinceNewYear()].split('\t');
      results = {
        MonthAndDay: `${results[5]}-${results[6]}`,
        Value: `${results[10]}`,
      };
    }
    collection.updateOne({ siteCode: `${siteid}` }, { $set: { todaysaverage: results } });
  });
};


export {updateMonthlySiteData, updateDailyAverage, updateCurrentWaterLevel};
