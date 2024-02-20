"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var authentication = function (req, res, next) {
    var header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    var token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    var decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req["currentUser"] = decode;
    next();
};
exports.authentication = authentication;
//# sourceMappingURL=authentication.middleware.js.map