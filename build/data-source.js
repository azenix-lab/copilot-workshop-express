"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var dotenv = require("dotenv");
var User_entity_1 = require("./entity/User.entity");
var Blog_entity_1 = require("./entity/Blog.entity");
dotenv.config();
var _a = process.env, DB_HOST = _a.DB_HOST, DB_PORT = _a.DB_PORT, DB_USERNAME = _a.DB_USERNAME, DB_PASSWORD = _a.DB_PASSWORD, DB_DATABASE = _a.DB_DATABASE, NODE_ENV = _a.NODE_ENV;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User_entity_1.User, Blog_entity_1.Blog],
    migrations: [__dirname + "/migrations/*.ts"],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map