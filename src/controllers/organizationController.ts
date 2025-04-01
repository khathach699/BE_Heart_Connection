import { Request, Response } from "express";
import organizationService from "../services/organizationService";
import { IOrganization } from "../types/Organization";
import mongoose from "mongoose";
export class OrganizationController {
    async requestUpgradeToOrganization(req: Request, res: Response) {
        try {
            const userId = req.body.userId; // Giả sử userId đang đăng nhập
            if (!userId) {
                throw res.status(400).json({ message: "User ID is required" });
            }
            const orgData: Partial<IOrganization> = {
                info: req.body.info,
                certificate: req.body.certificate,
                bankName: req.body.bankName,
                bankNumber: req.body.bankNumber,
            };
            const organization = await organizationService.requestUpgradeToOrganization(userId, orgData);
            res.status(201).json({ message: "Organization request created, awaiting approval", organization });
        } catch (error) {
            res.status(404).json({ message: (error as Error).message});
        }
    }

    async approveOrganization(req: Request, res: Response) {
        try {
            const orgId = req.params.id; // Giả sử orgId được gửi từ admin
            if (!orgId) {
                throw res.status(400).json({ message: "Organization ID is required" });
            }

            const organization = await organizationService.approveOrganization(orgId);
            res.status(200).json({ message: "Organization approved", organization });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async rejectOrganization(req: Request, res: Response) {
        try {
            const orgId = req.params.id;
            if (!orgId) {
                throw res.status(400).json({ message: "Organization ID is required" });
            }
            const organization = await organizationService.rejectOrganization(orgId);
            res.status(200).json({ message: "Organization request rejected", organization });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
    async getAllOrganizations(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const isVerified = req.query.isVerified === "true" ? true : req.query.isVerified === "false" ? false : undefined;

            const result = await organizationService.getAllOrganizations(page, limit, isVerified);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
    async getOrganizationById(req: Request, res: Response) {
        try {
            const orgId = req.params.id;
            if (!orgId) {
                throw res.status(400).json({ message: "Organization ID is required" });
            }

            const organization = await organizationService.getOrganizationById(orgId);
            res.status(200).json(organization);
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async deleteOrganization(req: Request, res: Response) {
        try {
            const orgId = req.params.id;
            if (!orgId) {
                throw res.status(400).json({ message: "Organization ID is required" });
            }
            const organization = await organizationService.deleteOrganization(orgId);
            res.status(200).json({ message: "Organization deleted", organization });
        } catch (error) {
            res.status(404).json({ message: (error as Error).message });
        }
    }
    async getAllOrganizationsWasReject(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await organizationService.getAllOrganizationsWasReject(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default new OrganizationController();