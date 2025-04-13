import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import roleRouter from "./role";
import roleRouteRouter from "./roleRoute";
import organizationRouter from "./organization";
import stateRouter from "./state";
import campaignRouter from "./campaigns";
import postRouter from "./posts";
import memberCampaignRouter from "./Member_campaign";
import donateCampaignRouter from "./Donate_campaign";
import notificationRouter from "./notification";
import typeTagRouter from "./Type_tag";
import tagRouter from "./Tag";
import contentRouter from "./content";
import userSocialRouter from "./User_social";
import socialTypeRouter from "./social_type";
import campTagRouter from "./Camp_tag";


const router = express.Router();

// Register all routes
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/roles", roleRouteRouter);
router.use("/organizations", organizationRouter);
router.use("/states", stateRouter);
router.use("/type-tags", typeTagRouter);
router.use("/tags", tagRouter);
router.use("/camp-tags", campTagRouter);
router.use("/campaigns", campaignRouter);
router.use("/posts", postRouter);
router.use("/member-campaign", memberCampaignRouter);
router.use("/donate-campaign", donateCampaignRouter);
router.use("/content", contentRouter);
router.use("/notifications", notificationRouter);
router.use("/social-types", socialTypeRouter);
router.use("/user-socials", userSocialRouter);
export default router;
