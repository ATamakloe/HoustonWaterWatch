import { Router } from "express";

interface Controller {
  router: Router;
  collection: any;
}

export default Controller;
