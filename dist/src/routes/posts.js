"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const router = express_1.default.Router();
router.put("/approve/:id", postController_1.default.approvePost.bind(postController_1.default));
router.put("/reject/:id", postController_1.default.rejectPost.bind(postController_1.default));
router.get("/", postController_1.default.getAllPosts.bind(postController_1.default));
router.get("/rejected", postController_1.default.getAllPostsWasReject.bind(postController_1.default));
router.get("/:id", postController_1.default.getPostById.bind(postController_1.default));
router.delete("/:id", postController_1.default.deletePost.bind(postController_1.default));
exports.default = router;
//# sourceMappingURL=posts.js.map