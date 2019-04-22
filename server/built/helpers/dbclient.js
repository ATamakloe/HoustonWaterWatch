var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from 'mongodb';
require('dotenv').config();
class dbClient {
    constructor() {
        this._uri = process.env.MONGO_URL;
        this.dbName = 'watersites';
        this.collname = 'sites';
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let dbclient = yield MongoClient.connect(this._uri, { useNewUrlParser: true });
            this.db = dbclient.db(this.dbName);
            this.collection = this.db.collection(this.collname);
            return this.collection;
        });
    }
}
export default new dbClient();
