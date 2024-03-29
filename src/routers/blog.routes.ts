import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { authorization } from "../middleware/authorization.middleware";
import { authentication } from "../middleware/authentication.middleware";

class BlogRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes() {
    this.router.get("/list", BlogController.getBlogs);
    this.router.get("/:id", BlogController.getBlog);
    this.router.post("/", authentication, authorization(['user']), BlogController.createBlog);
    this.router.get("/user/:name", BlogController.getUserBlogs);
    this.router.put("/:id", authentication, authorization, BlogController.updateBlog);
    this.router.delete("/:id", BlogController.deleteBlog);

    this.router.put("/admin/:id", BlogController.adminUpdateBlog);
    this.router.delete("/admin/:id", BlogController.adminDeleteBlog);
  }
}

export default new BlogRoutes().router;