"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authentication_middleware_1 = require("../middleware/authentication.middleware");
var authorization_middleware_1 = require("../middleware/authorization.middleware");
var user_controller_1 = require("../controllers/user.controller");
var Router = express.Router();
Router.get('/', user_controller_1.UserController.listUsers);
Router.post('/signup', user_controller_1.UserController.signup);
Router.get('/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['user'], user_controller_1.UserController.getUserById);
Router.put('/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['user'], user_controller_1.UserController.updateUser);
Router.delete('/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['user'], user_controller_1.UserController.deleteUser);
Router.get('/admin/', authentication_middleware_1.authentication, authorization_middleware_1.authorization['admin'], user_controller_1.UserController.adminGetUsers);
Router.put('/admin/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['admin'], user_controller_1.UserController.adminUpdateUser);
Router.delete('/admin/:id', authentication_middleware_1.authentication, authorization_middleware_1.authorization['admin'], user_controller_1.UserController.adminDeleteUser);
exports.default = Router;
//# sourceMappingURL=user.routes.js.map