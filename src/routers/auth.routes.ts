import { Router } from "express";
import { AuthContoller } from "../controllers/auth.controller";

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes() {
    this.router.post("/login", AuthContoller.login);
  }
}

export default new AuthRoutes().router;