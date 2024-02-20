"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var Router = express.Router();
Router.post('/login', auth_controller_1.AuthContoller.login);
exports.default = Router;
//# sourceMappingURL=auth.routes.js.map