import * as path from 'path';
import * as fs from 'fs';
const pathToCSVs = path.join(__dirname, '../','/waterdatacsv');

//This function was used to update the historical average for each day per site. No longer needed.
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
