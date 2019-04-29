var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fetch from 'isomorphic-fetch';
function updateMonthlySiteData(siteCodeArray, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteCodeArray.join(',')}&period=P30D&format=json&parameterCd=00065`;
        let siteDataArray;
        try {
            siteDataArray = yield fetch(url).then(data => data.json()).then(data => data.value.timeSeries);
            siteDataArray.forEach(site => {
                collection.updateOne({ siteCode: `${site.sourceInfo.siteCode["0"].value}` }, { $set: { lastmonthdata: site.values[0].value } });
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}
;
function updateCurrentWaterLevel(siteCodeArray, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteCodeArray.join(',')}&parameterCd=00065&period=PT45M&format=json`;
        try {
            let siteDataArray;
            let newWaterLevel;
            siteDataArray = yield fetch(url).then(data => data.json()).then(data => data.value.timeSeries);
            //If there are new values, update DB with values
            siteDataArray.forEach((site) => __awaiter(this, void 0, void 0, function* () {
                if (site.values[0].value.length > 0) {
                    newWaterLevel = site.values[0].value.pop().value;
                    collection.updateOne({ siteCode: `${site.sourceInfo.siteCode[0].value}` }, { $set: { WaterLevel: newWaterLevel } });
                }
            }));
        }
        catch (err) {
            console.error(err);
        }
    });
}
;
export { updateMonthlySiteData, updateCurrentWaterLevel };
