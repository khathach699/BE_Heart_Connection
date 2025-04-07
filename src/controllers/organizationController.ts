import { Request, Response } from "express";
import organizationService from "../services/organizationService";
import { IOrganization } from "../types/Organization";
import mongoose from "mongoose";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";

export class OrganizationController {
  async requestUpgradeToOrganization(req: Request, res: Response) {
    try {
      const userId = req.user.id; 
      if (!userId) {
        return CreateErrorResponse(res, 400, "User ID is required");
      }
      const orgData: Partial<IOrganization> = {
        info: req.body.info,
        certificate: req.body.certificate,
        bankName: req.body.bankName,
        bankNumber: req.body.bankNumber,
      };
      const organization =
        await organizationService.requestUpgradeToOrganization(userId, orgData);
      return CreateSuccessResponse(res, 201, {
        message: "Organization request created, awaiting approval",
        organization,
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async approveOrganization(req: Request, res: Response) {
    try {
      const orgId = req.params.id;
      if (!orgId) {
        return CreateErrorResponse(res, 400, "Organization ID is required");
      }
      const organization = await organizationService.approveOrganization(orgId);
      return CreateSuccessResponse(res, 200, { 
        message: "Organization approved", 
        organization 
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async rejectOrganization(req: Request, res: Response) {
    try {
      const orgId = req.params.id;
      if (!orgId) {
        return CreateErrorResponse(res, 400, "Organization ID is required");
      }
      const organization = await organizationService.rejectOrganization(orgId);
      return CreateSuccessResponse(res, 200, { 
        message: "Organization request rejected", 
        organization 
      });
    } catch (error) {
      return CreateErrorResponse(res, 400, (error as Error).message);
    }
  }

  async getAllOrganizations(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isVerified = req.query.isVerified === "true" ? true : 
                        req.query.isVerified === "false" ? false : undefined;

      const result = await organizationService.getAllOrganizations(page, limit, isVerified);
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }

  async getOrganizationById(req: Request, res: Response) {
    try {
      const orgId = req.params.id;
      if (!orgId) {
        return CreateErrorResponse(res, 400, "Organization ID is required");
      }
      const organization = await organizationService.getOrganizationById(orgId);
      return CreateSuccessResponse(res, 200, organization);
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async deleteOrganization(req: Request, res: Response) {
    try {
      const orgId = req.params.id;
      if (!orgId) {
        return CreateErrorResponse(res, 400, "Organization ID is required");
      }
      const organization = await organizationService.deleteOrganization(orgId);
      return CreateSuccessResponse(res, 200, { 
        message: "Organization deleted", 
        organization 
      });
    } catch (error) {
      return CreateErrorResponse(res, 404, (error as Error).message);
    }
  }

  async getAllOrganizationsWasReject(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await organizationService.getAllOrganizationsWasReject(page, limit);
      return CreateSuccessResponse(res, 200, result);
    } catch (error) {
      return CreateErrorResponse(res, 500, (error as Error).message);
    }
  }
}

export default new OrganizationController();
