"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var blog_controller_1 = require("../controllers/blog.controller");
var authentication_middleware_1 = require("../middleware/authentication.middleware");
var authorization_middleware_1 = require("../middleware/authorization.middleware");
var Router = express.Router();
Router.get('/list', blog_controller_1.BlogController.getBlogs);
Router.get('/:id', blog_controller_1.BlogController.getBlog);
Router.post('/', authentication_middleware_1.authentication, authorization_middleware_1.authorization['user'], blog_controller_1.BlogController.createBlog);
Router.put('/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['user'], blog_controller_1.BlogController.updateBlog);
Router.delete('/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['user'], blog_controller_1.BlogController.deleteBlog);
Router.put('/admin/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['admin'], blog_controller_1.BlogController.adminUpdateBlog);
Router.delete('/admin/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['admin'], blog_controller_1.BlogController.adminDeleteBlog);
exports.default = Router;
//# sourceMappingURL=blog.routes.js.map