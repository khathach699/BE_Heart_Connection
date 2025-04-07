import { Router } from "express";
import organizationController from "../controllers/organizationController";
import { check_authentication } from "../utils/check_auth";

const router = Router();

router.post("/request", organizationController.requestUpgradeToOrganization as unknown as any);
router.put("/approve/:id", organizationController.approveOrganization as unknown as any);
router.put("/reject/:id", organizationController.rejectOrganization as unknown as any);
router.get("/", organizationController.getAllOrganizations as unknown as any);
router.get("/trash", organizationController.getAllOrganizationsWasReject as unknown as any);
router.get("/:id", organizationController.getOrganizationById as unknown as any);
router.delete("/:id", organizationController.deleteOrganization as unknown as any);

export default router;