var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fetch from 'isomorphic-fetch';
function updateMonthlySiteData(siteid, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteid}&period=P30D&format=json&parameterCd=00065`;
        try {
            let last30Days = yield fetch(url).then(data => data.json());
            last30Days = last30Days.value.timeSeries[0].values[0].value;
            collection.updateOne({ siteCode: `${siteid}` }, { $set: { lastmonthdata: last30Days } });
        }
        catch (err) {
            console.error(err);
        }
    });
}
;
function updateCurrentWaterLevel(siteid, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteid}&parameterCd=00065&format=json`;
        let currentWaterLevel;
        try {
            currentWaterLevel = yield fetch(url).then(data => data.json());
            currentWaterLevel = currentWaterLevel.value.timeSeries[0].values[0].value[0].value;
            collection.updateOne({ siteCode: `${siteid}` }, { $set: { WaterLevel: currentWaterLevel } });
        }
        catch (err) {
            console.error(err);
        }
    });
}
;
export { updateMonthlySiteData, updateCurrentWaterLevel };
