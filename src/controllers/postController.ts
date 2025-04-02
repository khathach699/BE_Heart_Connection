import { Request, Response } from "express";
import postService from "../services/postService";
export class PostController {
    async approvePost(req: Request, res: Response) {
        try {
            const postId = req.params.id; 
            if (!postId) {
                throw res.status(400).json({ message: "Post ID is required" });
            }

            const post = await postService.approvePost(postId);
            res.status(200).json({ message: "Post approved", post });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async rejectPost(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            if (!postId) {
                throw res.status(400).json({ message: "Post ID is required" });
            }
            const post = await postService.rejectPost(postId);
            res.status(200).json({ message: "Post request rejected", post });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async getAllPosts(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const isAccepted = req.query.isAccepted === "true" ? true : req.query.isAccepted === "false" ? false : undefined;

            const result = await postService.getAllPosts(page, limit, isAccepted);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async getPostById(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            if (!postId) {
                throw res.status(400).json({ message: "Post ID is required" });
            }

            const post = await postService.getPostById(postId);
            res.status(200).json(post);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async deletePost(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            if (!postId) {
                throw res.status(400).json({ message: "Post ID is required" });
            }
            const post = await postService.deletePost(postId);
            res.status(200).json({ message: "Post deleted", post });
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async getAllPostsWasReject(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await postService.getAllPostsWasReject(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default new PostController();