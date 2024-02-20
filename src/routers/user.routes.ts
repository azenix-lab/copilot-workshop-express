import { Router } from "express";
import { UserController } from "../controllers/user.controller";

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes() {
    this.router.get("/", UserController.listUsers);
    this.router.post("/signup", UserController.signup);

    this.router.get("/:id", UserController.getUserById);
    this.router.put("/:id", UserController.updateUser);
    this.router.delete("/:id", UserController.deleteUser);

    this.router.get("/admin/", UserController.adminGetUsers);
    this.router.put("/admin/:id", UserController.adminUpdateUser);
    this.router.delete("/admin/:id", UserController.adminDeleteUser);
  }
}

export default new UserRoutes().router;