import { populate } from "dotenv";
import path from "path";
import UserSocial from "../schemas/User_social";
import { IUserSocial, IUserSocialDocument } from "../types/User_social";

export class UserSocialService {
    async getAllUserSocial(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: [
                    {
                        path: "user",
                        select: "email",
                    },
                    {
                        path: "social_type",
                        select: "name",
                    }
                ]
            };
            const query: any = { isdeleted: false };
            const result = await UserSocial.paginate(query, options);
            return {
                userSocials: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching user social: ${(error as Error).message}`);
        }
    }
    async getUserSocialById(userSocial_id: string): Promise<IUserSocialDocument> {
        try {
            const userSocial = await UserSocial.findOne({ _id: userSocial_id, isdeleted: false }).populate([
                {
                    path: "user",
                    select: "email",
                },
                {
                    path: "social_type",
                    select: "name",
                }
            ]);
            if (!userSocial) throw new Error("User social not found");
            return userSocial;
        } catch (error) {
            throw new Error(`Error fetching user social: ${(error as Error).message}`);
        }
    }
    async createUserSocial(userSocialData: IUserSocial): Promise<IUserSocialDocument> {
        try {
            const newusersocial = new UserSocial(userSocialData);
            const existingusersocial = await UserSocial.findOne({
                user: userSocialData.user,
                campaign: userSocialData.social_type,
                isdeleted: false
              });
            if (existingusersocial) throw new Error("user social already exists");
            return await newusersocial.save();
        } catch (error) {
            throw new Error(`Error creating user social: ${(error as Error).message}`);
        }
    }
    async updateUserSocial(id: string, UserSocialData: Partial<IUserSocial>): Promise<IUserSocialDocument> {
        try {
            const usersocial = await UserSocial.findOneAndUpdate(
                { _id: id, isdeleted: false },
                UserSocialData,
                { new: true }
            );
            if (!usersocial) throw new Error("user social not found");
            return usersocial;
        } catch (error) {
            throw new Error(`Error updating user social: ${(error as Error).message}`);
        }
    }
     async deleteUserSocial(id: string): Promise<IUserSocialDocument> {
        try {
            const usersocial = await UserSocial.findOneAndUpdate(
                { _id: id, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!usersocial) throw new Error("user social not found");
            return usersocial;
        } catch (error) {
            throw new Error(`Error deleting user social: ${(error as Error).message}`);
        }
    }
}

export default new UserSocialService();