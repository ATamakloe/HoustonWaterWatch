import * as express from "express";
import * as bodyParser from "body-parser";
import * as expressValidator from "express-validator";
import Controller from "./interfaces/controllerinterface";
import SitesController from "./sites/sitescontroller";
require("dotenv").config();

class App {
  public app: express.Application;
  public collection: any;
  public port: number = parseInt(process.env.PORT) || 3001;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.middleware();
    this.initializeControllers(controllers);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Live on port ${this.port}`);
    });
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }
  private middleware(): void {
    this.app.use(expressValidator());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default App;
