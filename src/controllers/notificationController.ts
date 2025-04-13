import { Request, Response } from "express";
import notificationService from "../services/notificationService";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";

export class NotificationController {
    async getUserNotifications(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const result = await notificationService.getUserNotifications(userId, page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const notificationId = req.params.id;
            const notification = await notificationService.markAsRead(notificationId);
            return CreateSuccessResponse(res, 200, notification);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteNotification(req: Request, res: Response) {
        try {
            const notificationId = req.params.id;
            const notification = await notificationService.deleteNotification(notificationId);
            return CreateSuccessResponse(res, 200, notification);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getUnreadCount(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const count = await notificationService.getUnreadCount(userId);
            return CreateSuccessResponse(res, 200, { unreadCount: count });
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async createNotification(req: Request, res: Response) {
        try {
            const notificationData = {
                user: req.body.user,
                content: req.body.content,
                isRead: false,
                isDeleted: false
            };
            
            const notification = await notificationService.createNotification(notificationData);
            return CreateSuccessResponse(res, 201, notification);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
}

export default new NotificationController();
