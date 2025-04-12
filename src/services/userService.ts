import User from "../schemas/User";
import { IUser, IUserDocument } from "../types/user";
import Campaign from "../schemas/Campaign";

export class UserService {
  async createUser(userData: IUser): Promise<IUserDocument> {
    try {
      const newUser = new User(userData);
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) throw new Error("Email already exists");
      return (await newUser.save()) as unknown as IUserDocument;
    } catch (error) {
      throw new Error(`Error creating user: ${(error as Error).message}`);
    }
  }
  async getAllUsers(page: number = 1, limit: number = 1, isdeleted: string ): Promise<any> {
    try {
      const options = {
        page,
        limit,
        isdeleted: isdeleted === "true" ? true : false,
        sort: { createdAt: -1 },
        populate: { path: "role" },
      };
      const result = await (User as any).paginate(
        { isdeleted: options.isdeleted },
        options
      );
      if (page > result.totalPages && result.totalDocs > 0) {
        throw new Error("Page not found");
      }
      return {
        users: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${(error as Error).message}`);
    }
  }
  async getUserById(id: string): Promise<IUserDocument> {
    try {
      const user = await User.findOne({ _id: id, isdeleted: false })
        .populate("role")
        .select("+password");
      if (!user) throw new Error("User not found");
      return user as unknown as IUserDocument;
    } catch (error) {
      throw new Error(`Error fetching user: ${(error as Error).message}`);
    }
  }
  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUserDocument> {
    try {
      const user = await User.findOneAndUpdate(
        { _id: id, isdeleted: false },
        userData,
        { new: true }
      );
      if (!user) throw new Error("User not found");
      return user as unknown as IUserDocument;
    } catch (error) {
      throw new Error(`Error updating user: ${(error as Error).message}`);
    }
  }
  async deleteUser(id: string): Promise<IUserDocument> {
    try {
      const user = await User.findOneAndUpdate(
        { _id: id, isdeleted: false },
        { isdeleted: true },
        { new: true }
      );
      if (!user) throw new Error("User not found");
      return user as unknown as IUserDocument;
    } catch (error) {
      throw new Error(`Error deleting user: ${(error as Error).message}`);
    }
  }

  async getFeaturedUsers(limit: number = 5): Promise<IUserDocument[]> {
    try {
      // Get users with the highest points
      const users = await User.find({ isdeleted: false })
        .sort({ point: -1 }) // Sort by points in descending order
        .limit(limit)
        .populate("role");

      return users as unknown as IUserDocument[];
    } catch (error) {
      throw new Error(
        `Error fetching featured users: ${(error as Error).message}`
      );
    }
  }
  async updateUserPoint(userId: string): Promise<IUserDocument> {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      const currentPoint = Number(user.point) || 0;
      user.point = currentPoint + 1;

      await user.save();
      return user as unknown as IUserDocument;
    } catch (error) {
      throw new Error(`Error updating user point: ${(error as Error).message}`);
    }
  }
}

export default new UserService();
