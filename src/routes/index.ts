import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import roleRouter from "./role";
import roleRouteRouter from "./roleRoute";
import organizationRouter from "./organization";
import stateRouter from "./state";
import campaignRouter from "./campaigns";
import postRouter from "./posts";
import memberCampaignRouter from "./memberCampaign";

const router = express.Router();

// Register all routes
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/roles", roleRouteRouter);
router.use("/organizations", organizationRouter);
router.use("/states", stateRouter);
router.use("/campaigns", campaignRouter);
router.use("/posts", postRouter);
router.use("/member-campaign", memberCampaignRouter);

export default router;
