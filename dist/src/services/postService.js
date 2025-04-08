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
exports.PostService = void 0;
const Post_1 = __importDefault(require("../schemas/Post"));
class PostService {
    approvePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post_1.default.findOne({ _id: postId, isdeleted: false });
                if (!post)
                    throw new Error("Post not found");
                if (post.isAccepted)
                    throw new Error("Post already accepted");
                post.isAccepted = true;
                yield post.save();
                return post;
            }
            catch (error) {
                throw new Error(`Error approving post: ${error.message}`);
            }
        });
    }
    rejectPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post_1.default.findById(postId);
                if (!post)
                    throw new Error("Post not found");
                if (post.isAccepted)
                    throw new Error("Post already accepted, cannot be rejected");
                post.isdeleted = true;
                yield post.save();
                return post;
            }
            catch (error) {
                throw new Error(`Error rejecting post: ${error.message}`);
            }
        });
    }
    getAllPosts() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, isAccepted) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: "organization",
                };
                const query = { isdeleted: false };
                if (isAccepted !== undefined) {
                    query.isAccepted = isAccepted;
                }
                const result = yield Post_1.default.paginate(query, options);
                return {
                    posts: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching posts: ${error.message}`);
            }
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post_1.default.findOne({ _id: postId, isdeleted: false }).populate("organization");
                if (!post)
                    throw new Error("Post not found");
                return post;
            }
            catch (error) {
                throw new Error(`Error fetching post: ${error.message}`);
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Post_1.default.findOneAndUpdate({ _id: postId, isdeleted: false }, { isdeleted: true }, { new: true });
                if (!result) {
                    throw new Error("Post not found or already accepted");
                }
            }
            catch (error) {
                throw new Error(`Error deleting post: ${error.message}`);
            }
        });
    }
    getAllPostsWasReject() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                    populate: "organization",
                };
                const result = yield Post_1.default.paginate({ isdeleted: true }, options);
                return {
                    posts: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching post: ${error.message}`);
            }
        });
    }
}
exports.PostService = PostService;
exports.default = new PostService();
//# sourceMappingURL=postService.js.map