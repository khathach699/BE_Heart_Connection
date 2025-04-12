import { Request, Response } from "express";
import postService from "../services/postService";
import { CreateErrorResponse, CreateSuccessResponse } from "../utils/responnseHandler";
export class PostController {
    async approvePost(req: Request, res: Response) {
        try {
            const postId = req.params.id; 
            if (!postId) {
                throw CreateErrorResponse(res, 400, "Post ID is required");
            }

            const post = await postService.approvePost(postId);
            CreateSuccessResponse(res, 200, { message: "Post approved", post });
        } catch (error) {
            CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
    async rejectPost(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            if (!postId) {
                throw CreateErrorResponse(res, 400, "Post ID is required");
            }
            const post = await postService.rejectPost(postId);
            CreateSuccessResponse(res, 200, { message: "Post request rejected", post });
        } catch (error) {
            CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
    async getAllPosts(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const isAccepted = req.query.isAccepted === "true" ? true : req.query.isAccepted === "false" ? false : undefined;

            const result = await postService.getAllPosts(page, limit, isAccepted);
            CreateSuccessResponse(res, 200, result);
        } catch (error) {
            CreateErrorResponse(res, 500, (error as Error).message);
        }
    }
    async getPostById(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            if (!postId) {
                throw CreateErrorResponse(res, 400, "Post ID is required");
            }

            const post = await postService.getPostById(postId);
            CreateSuccessResponse(res, 200, post);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async deletePost(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            if (!postId) {
                throw CreateErrorResponse(res, 400, "Post ID is required");
            }
            const post = await postService.deletePost(postId);
            CreateSuccessResponse(res, 200, { message: "Post deleted", post });
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async getAllPostsWasReject(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await postService.getAllPostsWasReject(page, limit);
            CreateSuccessResponse(res, 200, result);
        } catch (error) {
            CreateErrorResponse(res, 500, (error as Error).message);
        }
    }
}

export default new PostController();