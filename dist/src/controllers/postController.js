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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const postService_1 = __importDefault(require("../services/postService"));
class PostController {
    approvePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                if (!postId) {
                    throw res.status(400).json({ message: "Post ID is required" });
                }
                const post = yield postService_1.default.approvePost(postId);
                res.status(200).json({ message: "Post approved", post });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    rejectPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                if (!postId) {
                    throw res.status(400).json({ message: "Post ID is required" });
                }
                const post = yield postService_1.default.rejectPost(postId);
                res.status(200).json({ message: "Post request rejected", post });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const isAccepted = req.query.isAccepted === "true" ? true : req.query.isAccepted === "false" ? false : undefined;
                const result = yield postService_1.default.getAllPosts(page, limit, isAccepted);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                if (!postId) {
                    throw res.status(400).json({ message: "Post ID is required" });
                }
                const post = yield postService_1.default.getPostById(postId);
                res.status(200).json(post);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                if (!postId) {
                    throw res.status(400).json({ message: "Post ID is required" });
                }
                const post = yield postService_1.default.deletePost(postId);
                res.status(200).json({ message: "Post deleted", post });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    getAllPostsWasReject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield postService_1.default.getAllPostsWasReject(page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.PostController = PostController;
exports.default = new PostController();
//# sourceMappingURL=postController.js.map