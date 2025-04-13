import { Router } from "express";
import { check_authentication } from "../utils/check_auth";
import NotificationController from "../controllers/notificationController";

const router = Router();
router.post("/", NotificationController.createNotification as unknown as any);

router.use(check_authentication); 
router.get("/", NotificationController.getUserNotifications as unknown as any);
router.get("/unread-count", NotificationController.getUnreadCount as unknown as any);
router.put("/:id/read", NotificationController.markAsRead as unknown as any);
router.delete("/:id", NotificationController.deleteNotification as unknown as any);
export default router;
