import mongoose from "mongoose";
import Organization from "../schemas/Organization";
import User from "../schemas/User";
import { IOrganization, IOrganizationDocument } from "../types/Organization";
import userService from "./userService";
import Role from "../schemas/Role";
import { IUserDocument } from "../types/user";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
export class OrganizationService {
  //Sua them anh
  private readonly serverCDN: string = "http://localhost:4000/upload";
  private readonly avatarDir: string = path.join(__dirname, "../images");
  async requestUpgradeToOrganization(
    userId: string,
    orgData: Partial<IOrganization>,
    certificateFile: Express.Multer.File
  ): Promise<IOrganizationDocument> {
    try {
      const user = await userService.getUserById(userId);
      if (!user) throw new Error("User not found");
      if (user.organization) throw new Error("User already has an organization");

      const existingRequest = await Organization.findOne({
        user: userId,
        isdeleted: false,
        isVerified: false,
      });
      if (existingRequest) throw new Error("User already has a request for organization upgrade");

      const imgPath = path.join(this.avatarDir, certificateFile.filename);
      const newForm = new FormData();
      newForm.append("avatar", fs.createReadStream(imgPath));

      let result;
      try {
        result = await axios.post(this.serverCDN, newForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (axiosError: any) {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        throw new Error(`Không thể upload certificate lên CDN: ${axiosError.message}`);
      }
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

      const certificateUrl = result.data.data;
      console.log("certificateUrl", certificateUrl);
      if (!certificateUrl) {
        throw new Error("Không nhận được URL từ CDN");
      }

      const organization = new Organization({
        ...orgData,
        certificate: certificateUrl,
        user: userId,
        isVerified: false,
        isdeleted: false,
      });
      const savedOrg: IOrganizationDocument = await organization.save();
      return savedOrg;
    } catch (error) {
      throw new Error(
        `Error requesting organization: ${(error as Error).message}`
      );
    }
  }
  async approveOrganization(orgId: string): Promise<IOrganizationDocument> {
    try {
      const organization = await Organization.findOne({
        _id: orgId,
        isdeleted: false,
      });
      if (!organization) throw new Error("Organization not found");
      if (organization.isVerified)
        throw new Error("Organization already verified");
      organization.isVerified = true;

      // Cập nhật role của user thành "Organization"
      const user = await User.findById(organization.user);
      if (user) {
        const orgRole = await Role.findOne({ name: "organization" });
        if (!orgRole) throw new Error("Role 'organization' not found");
        user.role = orgRole._id as mongoose.Types.ObjectId;
        user.organization = organization._id as mongoose.Types.ObjectId;
        await user.save();
        await organization.save();
      }
      return organization;
    } catch (error) {
      throw new Error(
        `Error approving organization: ${(error as Error).message}`
      );
    }
  }

  async rejectOrganization(orgId: string): Promise<IOrganizationDocument> {
    try {
      const organization = await Organization.findById(orgId);
      if (!organization) throw new Error("Organization not found");
      if (organization.isVerified)
        throw new Error("Organization already verified, cannot reject");

      organization.isdeleted = true;
      await organization.save();

      return organization;
    } catch (error) {
      throw new Error(
        `Error rejecting organization: ${(error as Error).message}`
      );
    }
  }
  async getAllOrganizations(
    page: number = 1,
    limit: number = 10,
    isVerified?: boolean
  ) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: "user",
      };

      const query: any = { isdeleted: false };
      if (isVerified !== undefined) {
        query.isVerified = isVerified;
      }

      const result = await Organization.paginate(query, options);
      return {
        organizations: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(
        `Error fetching organizations: ${(error as Error).message}`
      );
    }
  }
  async getOrganizationById(orgId: string): Promise<IOrganizationDocument> {
    try {
      const organization = await Organization.findOne({
        _id: orgId,
        isdeleted: false,
      }).populate("user");
      if (!organization) throw new Error("Organization not found");
      return organization;
    } catch (error) {
      throw new Error(
        `Error fetching organization: ${(error as Error).message}`
      );
    }
  }

  async getOrganizationByUserId(
    userId: string
  ): Promise<IOrganizationDocument | null> {
    try {
      const organization = await Organization.findOne({
        user: userId,
        isdeleted: false,
      }).populate("user");
      if (!organization) throw new Error("Organization not found");
      return organization;
    } catch (error) {
      throw new Error(
        `Error fetching User organization: ${(error as Error).message}`
      );
    }
  }
  async deleteOrganization(orgId: string) {
    try {
      const organization = await Organization.findById({_id:orgId, isVerified: false, isdeleted: true});
      if (!organization) {
        throw new Error("Organization not found");
      }
      if (organization.isVerified) {
        throw new Error("Cannot delete a verified organization");
      }
      
      if (organization.certificate) {
        const filename = organization.certificate.split("/").pop();
        try {
          await axios.delete(`http://localhost:4000/images/${filename}`);
        } catch (cdnError:any) {
          console.error(`Failed to delete certificate from CDN: ${cdnError.message}`);
        }
      }
      const result = await Organization.deleteOne({
        _id: orgId,
        isVerified: false,
        isdeleted: true,
      });
      if (result.deletedCount === 0) {
        throw new Error("Organization not found or already verified");
      }
    } catch (error) {
      throw new Error(
        `Error deleting organization: ${(error as Error).message}`
      );
    }
  }

  async getAllOrganizationsWasReject(page: number = 1, limit: number = 10) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: "user",
      };

      const result = await Organization.paginate({ isdeleted: true }, options);

      return {
        organizations: result.docs,
        total: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
      };
    } catch (error) {
      throw new Error(
        `Error fetching organizations: ${(error as Error).message}`
      );
    }
  }
  cleanupFile(files: Express.Multer.File[]): void {
    files.forEach((file) => {
      const imgPath = path.join(this.avatarDir, file.filename);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });
  }
}

export default new OrganizationService();
