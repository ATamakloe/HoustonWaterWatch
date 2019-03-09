import { MongoClient } from 'mongodb';

class dbWrapper {
  private _uri:string = process.env.MONGO_URI;
  private dbName:string = 'watersites';
  private collname:string = 'sites';
  public db: any;
  public collection:any;

  public async connect() {
    let dbclient = await MongoClient.connect(this._uri, { useNewUrlParser: true });
    this.db = dbclient.db(this.dbName)
    this.collection = this.db.collection(this.collname);
    return this.collection;
  }
}

export default new dbWrapper();
