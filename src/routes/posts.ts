import { Router } from "express";
import postController from "../controllers/postController";
import { check_authentication } from "../utils/check_auth";

const router = Router();

router.put("/approve/:id", postController.approvePost as unknown as any);
router.put("/reject/:id", postController.rejectPost as unknown as any);
router.get("/", postController.getAllPosts as unknown as any);
router.get("/search", postController.searchPosts as unknown as any);
router.get("/rejected", postController.getAllPostsWasReject as unknown as any);
router.get("/:id", postController.getPostById as unknown as any);
router.delete("/:id", postController.deletePost as unknown as any);
router.post("/like/:id", check_authentication, postController.likePost as unknown as any);

export default router;