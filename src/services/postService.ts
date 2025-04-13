import Post from "../schemas/Post";
import { IPost, IPostDocument } from "../types/Post";
import PostLike from "../schemas/Post_like";

export class PostService {
  async approvePost(postId: string): Promise<IPostDocument> {
        try {
            const post = await Post.findOne({ _id: postId, isdeleted: false });
            if (!post) throw new Error("Post not found");
            if (post.isAccepted) throw new Error("Post already accepted");
            post.isAccepted = true;
            await post.save();
            return post;
        } catch (error) {
            throw new Error(`Error approving post: ${(error as Error).message}`);
        }
    }
    async rejectPost(postId: string): Promise<IPostDocument> {
        try {
            const post = await Post.findById(postId);
            if (!post) throw new Error("Post not found");
            if (post.isAccepted) throw new Error("Post already accepted, cannot be rejected");

            post.isdeleted = true;
            await post.save();

            return post;
        } catch (error) {
            throw new Error(`Error rejecting post: ${(error as Error).message}`);
        }
    }
    async getAllPosts(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: "organization",
            };

            const query: any = { isdeleted: false };
            if (isAccepted !== undefined) {
                query.isAccepted = isAccepted;
            }

            const result = await Post.paginate(query, options);
            return {
                posts: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching posts: ${(error as Error).message}`);
        }
    }
    async getPostById(postId: string): Promise<IPostDocument> {
        try {
            const post = await Post.findOne({ _id: postId, isdeleted: false }).populate("organization");
            if (!post) throw new Error("Post not found");
            return post;
        } catch (error) {
            throw new Error(`Error fetching post: ${(error as Error).message}`);
        }
    }
    async deletePost(postId: string) {
        try {
            const result = await Post.findOneAndUpdate(
                { _id: postId, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!result) {
                throw new Error("Post not found or already accepted");
            }
        } catch (error) {
            throw new Error(`Error deleting post: ${(error as Error).message}`);
        }
    }
    async getAllPostsWasReject(page: number = 1, limit: number = 10) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: "organization",
            };

            const result = await Post.paginate({ isdeleted: true }, options);

            return {
                posts: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching post: ${(error as Error).message}`);
        }
    }
    async likePost(postId: string, userId: string): Promise<IPostDocument> {
        try {
            const existingLike = await PostLike.findOne({
                post: postId,
                user: userId,
                isdeleted: false
            });

            if (existingLike) {
                throw new Error("User has already liked this post");
            }
            const newLike = new PostLike({
                post: postId,
                user: userId
            });
            await newLike.save();
            const post = await Post.findById(postId);
            if (!post) {
                throw new Error("Post not found");
            }

            post.liked = (post.liked || 0) + 1;
            await post.save();

            return post;
        } catch (error) {
            throw new Error(`Error liking post: ${(error as Error).message}`);
        }
    }
    async getPostByOrgId(orgId: string, page: number, limit: number) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: "organization",
            };

            const result = await Post.paginate(
                { organization: orgId, isdeleted: false },
                options
            );

            return {
                posts: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching post by orgId: ${(error as Error).message}`);
        }
    }
    async searchPosts(searchQuery: string, page: number = 1, limit: number = 10) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: {
                    path: 'organization',
                    select: 'info'
                }
            };

            const query = {
                isdeleted: false,
                $or: [
                    { text: { $regex: searchQuery, $options: 'i' } },
                ]
            };

            const result = await Post.paginate(query, options);

            return {
                posts: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error searching posts: ${(error as Error).message}`);
        }
    }
        
}

export default new PostService();