import Notification from "../schemas/Notification";
import { INotification, INotificationDocument } from "../types/Notification";

export class NotificationService {
    async createNotification(notificationData: INotification): Promise<INotificationDocument> {
        try {
            const notification = new Notification(notificationData);
            return await notification.save();
        } catch (error) {
            throw new Error(`Error creating notification: ${(error as Error).message}`);
        }
    }

    async getUserNotifications(userId: string, page: number = 1, limit: number = 10) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: {
                    path: 'content',
                    select: 'code message'
                }
            };

            const result = await Notification.paginate(
                { user: userId, isDeleted: false },
                options
            );

            return {
                notifications: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching notifications: ${(error as Error).message}`);
        }
    }

    async markAsRead(notificationId: string): Promise<INotificationDocument> {
        try {
            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );
            if (!notification) throw new Error("Notification not found");
            return notification;
        } catch (error) {
            throw new Error(`Error marking notification as read: ${(error as Error).message}`);
        }
    }

    async deleteNotification(notificationId: string): Promise<INotificationDocument> {
        try {
            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                { isDeleted: true },
                { new: true }
            );
            if (!notification) throw new Error("Notification not found");
            return notification;
        } catch (error) {
            throw new Error(`Error deleting notification: ${(error as Error).message}`);
        }
    }

    async getUnreadCount(userId: string): Promise<number> {
        try {
            return await Notification.countDocuments({ user: userId, isRead: false, isDeleted: false });
        } catch (error) {
            throw new Error(`Error counting unread notifications: ${(error as Error).message}`);
        }
    }
}

export default new NotificationService();
