import express from "express";
import postController from "../controllers/postController";

const router = express.Router();
router.put("/approve/:id", postController.approvePost.bind(postController));
router.put("/reject/:id", postController.rejectPost.bind(postController));
router.get("/", postController.getAllPosts.bind(postController));
router.get("/rejected", postController.getAllPostsWasReject.bind(postController));
router.get("/:id", postController.getPostById.bind(postController));
router.delete("/:id", postController.deletePost.bind(postController));
export default router;