import { MongoClient } from 'mongodb';
require('dotenv').config();

class dbWrapper {
  private _uri: string = process.env.MONGO_URL;
  private dbName: string = 'watersites';
  private collname: string = 'sites';
  public db: any;
  public collection: any;

  public async connect() {
    let dbclient = await MongoClient.connect(this._uri, { useNewUrlParser: true });
    this.db = dbclient.db(this.dbName)
    this.collection = this.db.collection(this.collname);
    return this.collection;
  }
}

const dbInstance = new dbWrapper;

export default dbInstance;
