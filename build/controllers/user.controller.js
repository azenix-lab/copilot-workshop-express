"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var data_source_1 = require("../data-source");
var User_entity_1 = require("../entity/User.entity");
var encrypt_1 = require("../helpers/encrypt");
var user_dto_1 = require("../dto/user.dto");
var cache = require("memory-cache");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, password, role, encrypedPassword, user, userRepository, userDataSent, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, email = _a.email, password = _a.password, role = _a.role;
                        return [4 /*yield*/, encrypt_1.encrypt.encryptpass(password)];
                    case 1:
                        encrypedPassword = _b.sent();
                        user = new User_entity_1.User();
                        user.name = name;
                        user.email = email;
                        user.password = encrypedPassword;
                        user.role = role;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.save(user)];
                    case 2:
                        _b.sent();
                        userDataSent = new user_dto_1.UserResponse();
                        userDataSent.name = user.name;
                        userDataSent.email = user.email;
                        userDataSent.role = user.role;
                        token = encrypt_1.encrypt.generateToken({ id: user.id });
                        return [2 /*return*/, res.status(201).json({ message: "User created successfully", user: userDataSent, token: token })];
                }
            });
        });
    };
    UserController.listUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userRepository, users, userResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req || !res) {
                            console.error('Request or Response objects are undefined');
                            return [2 /*return*/];
                        }
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        if (!userRepository) {
                            console.error('User repository is undefined');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, userRepository.find()];
                    case 1:
                        users = _a.sent();
                        if (!users) {
                            console.error('No users found');
                            return [2 /*return*/, res.status(404).json({ message: 'No users found' })];
                        }
                        userResponse = users.map(function (user) {
                            if (!user || !user.name) {
                                console.error('User or user name is undefined');
                                return;
                            }
                            var userRes = new user_dto_1.UserList();
                            userRes.name = user.name;
                            return userRes;
                        });
                        return [2 /*return*/, res.status(200).json(userResponse)];
                }
            });
        });
    };
    UserController.getUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, userRepository, users, userResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = cache.get("users");
                        if (!data) return [3 /*break*/, 1];
                        return [2 /*return*/, res.status(200).json(data)];
                    case 1:
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.find()];
                    case 2:
                        users = _a.sent();
                        userResponse = users.map(function (user) {
                            var userRes = new user_dto_1.UserResponse();
                            userRes.name = user.name;
                            userRes.email = user.email;
                            userRes.role = user.role;
                            return userRes;
                        });
                        cache.put("users", userResponse, 60000);
                        return [2 /*return*/, res.status(200).json(userResponse)];
                }
            });
        });
    };
    UserController.getUserById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, id, userRepository, user, userResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentUser = req["currentUser"];
                        if (currentUser.id !== req.params.id) {
                            return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                        }
                        id = req.params.id;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.findOne({ where: { id: id } })];
                    case 1:
                        user = _a.sent();
                        userResponse = new user_dto_1.UserResponse();
                        userResponse.name = user.name;
                        userResponse.email = user.email;
                        userResponse.role = user.role;
                        return [2 /*return*/, res.status(200).json(userResponse)];
                }
            });
        });
    };
    UserController.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, id, _a, name, email, userRepository, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentUser = req["currentUser"];
                        if (currentUser.id !== req.params.id) {
                            return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                        }
                        id = req.params.id;
                        _a = req.body, name = _a.name, email = _a.email;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.findOne({ where: { id: id } })];
                    case 1:
                        user = _b.sent();
                        user.name = name;
                        user.email = email;
                        return [4 /*yield*/, userRepository.save(user)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User updated successfully" })];
                }
            });
        });
    };
    UserController.deleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, id, userRepository;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentUser = req["currentUser"];
                        if (currentUser.id !== req.params.id) {
                            return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                        }
                        id = req.params.id;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.delete(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User deleted successfully" })];
                }
            });
        });
    };
    UserController.adminGetUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userRepository, users, userResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.find()];
                    case 1:
                        users = _a.sent();
                        userResponse = users.map(function (user) {
                            var userRes = new user_dto_1.UserResponse();
                            userRes.name = user.name;
                            userRes.email = user.email;
                            userRes.role = user.role;
                            return userRes;
                        });
                        return [2 /*return*/, res.status(200).json(userResponse)];
                }
            });
        });
    };
    UserController.adminUpdateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, name, email, role, userRepository, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _a = req.body, name = _a.name, email = _a.email, role = _a.role;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.findOne({ where: { id: id } })];
                    case 1:
                        user = _b.sent();
                        user.name = name;
                        user.email = email;
                        user.role = role;
                        return [4 /*yield*/, userRepository.save(user)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User updated successfully" })];
                }
            });
        });
    };
    UserController.adminDeleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userRepository;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
                        return [4 /*yield*/, userRepository.delete(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User deleted successfully" })];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
module.exports = UserController;
//# sourceMappingURL=user.controller.js.map