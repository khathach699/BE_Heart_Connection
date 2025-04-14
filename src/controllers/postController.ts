import { Request, Response } from "express";
import postService from "../services/postService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

export class PostController {
  async approvePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      if (!postId) {
        return CreateErrorResponse(res, 400, "Post ID is required");
      }
      const post = await postService.approvePost(postId);
      return CreateSuccessResponse(res, 200, {
        message: "Post approved",
        post,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async rejectPost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      if (!postId) {
        return CreateErrorResponse(res, 400, "Post ID is required");
      }
      const post = await postService.rejectPost(postId);
      return CreateSuccessResponse(res, 200, {
        message: "Post request rejected",
        post,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }
  async getAllPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isAccepted =
        req.query.isAccepted === "true"
          ? true
          : req.query.isAccepted === "false"
          ? false
          : undefined;

      const result = await postService.getAllPosts(page, limit, isAccepted);
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      if (!postId) {
        return CreateErrorResponse(res, 400, "Post ID is required");
      }

      const post = await postService.getPostById(postId);
      return CreateSuccessResponse(res, 200, post);
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  async deletePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      if (!postId) {
        return CreateErrorResponse(res, 400, "Post ID is required");
      }
      const post = await postService.deletePost(postId);
      return CreateSuccessResponse(res, 200, { message: "Post deleted", post });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }
  async getAllPostsWasReject(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await postService.getAllPostsWasReject(page, limit);
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }

  async likePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const userId = req.user._id;

      if (!postId) {
        return CreateErrorResponse(res, 400, "Post ID is required");
      }

      const post = await postService.likePost(postId, userId);
      return CreateSuccessResponse(res, 200, {
        message: "Post liked successfully",
        likes: post.liked,
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async searchPosts(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        return CreateErrorResponse(res, 400, "Search query is required");
      }

      const result = await postService.searchPosts(
        query as string,
        page,
        limit
      );
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}

export default new PostController();
