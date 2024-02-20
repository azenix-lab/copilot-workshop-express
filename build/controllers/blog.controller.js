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
exports.BlogController = void 0;
var data_source_1 = require("../data-source");
var Blog_entity_1 = require("../entity/Blog.entity");
var blog_dto_1 = require("../dto/blog.dto");
var cache = require("memory-cache");
var BlogController = /** @class */ (function () {
    function BlogController() {
    }
    BlogController.createBlog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, content, blog, blogRepository, blogDataSent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, title = _a.title, content = _a.content;
                        blog = new Blog_entity_1.Blog();
                        blog.title = title;
                        blog.content = content;
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.save(blog)];
                    case 1:
                        _b.sent();
                        blogDataSent = new blog_dto_1.BlogResponse();
                        blogDataSent.title = blog.title;
                        blogDataSent.content = blog.content;
                        return [2 /*return*/, res.status(201).json({ message: "Blog created successfully", blog: blogDataSent })];
                }
            });
        });
    };
    BlogController.getBlogs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, blogRepository, blogs, blogResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = cache.get("blogsTitles");
                        if (!data) return [3 /*break*/, 1];
                        return [2 /*return*/, res.status(200).json(data)];
                    case 1:
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.find()];
                    case 2:
                        blogs = _a.sent();
                        blogResponse = blogs.map(function (blog) {
                            var blogRes = new blog_dto_1.BlogList();
                            blogRes.title = blog.title;
                            return blogRes;
                        });
                        cache.put("blogsTitles", blogResponse, 60000);
                        return [2 /*return*/, res.status(200).json(blogResponse)];
                }
            });
        });
    };
    BlogController.getBlog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, blogRepository, blog, blogDataSent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.findOne({ where: { id: id } })];
                    case 1:
                        blog = _a.sent();
                        blogDataSent = new blog_dto_1.BlogResponse();
                        blogDataSent.title = blog.title;
                        blogDataSent.content = blog.content;
                        return [2 /*return*/, res.status(200).json(blogDataSent)];
                }
            });
        });
    };
    BlogController.updateBlog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, id, _a, title, content, blogRepository, blog;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentUser = req["currentUser"];
                        if (currentUser.role !== "admin") {
                            return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                        }
                        id = req.params.id;
                        _a = req.body, title = _a.title, content = _a.content;
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.findOne({ where: { id: id } })];
                    case 1:
                        blog = _b.sent();
                        blog.title = title;
                        blog.content = content;
                        return [4 /*yield*/, blogRepository.save(blog)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Blog updated successfully" })];
                }
            });
        });
    };
    BlogController.deleteBlog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, id, blogRepository;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentUser = req["currentUser"];
                        if (currentUser.role !== "admin") {
                            return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                        }
                        id = req.params.id;
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.delete({ id: id })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Blog deleted successfully" })];
                }
            });
        });
    };
    BlogController.adminUpdateBlog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, title, content, blogRepository, blog;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _a = req.body, title = _a.title, content = _a.content;
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.findOne({ where: { id: id } })];
                    case 1:
                        blog = _b.sent();
                        blog.title = title;
                        blog.content = content;
                        return [4 /*yield*/, blogRepository.save(blog)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Blog updated successfully" })];
                }
            });
        });
    };
    BlogController.adminDeleteBlog = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, blogRepository;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        blogRepository = data_source_1.AppDataSource.getRepository(Blog_entity_1.Blog);
                        return [4 /*yield*/, blogRepository.delete({ id: id })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "Blog deleted successfully" })];
                }
            });
        });
    };
    return BlogController;
}());
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map