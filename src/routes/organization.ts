import express from "express";
import organizationController from "../controllers/organizationController";

const router = express.Router();

router.post(
  "/request",
  organizationController.requestUpgradeToOrganization.bind(
    organizationController
  )
);
router.put("/approve/:id", organizationController.approveOrganization);
router.put("/reject/:id", organizationController.rejectOrganization);
router.get("/", organizationController.getAllOrganizations);
router.get(
  "/trash",
  organizationController.getAllOrganizationsWasReject.bind(
    organizationController
  )
);
router.get("/:id", organizationController.getOrganizationById);
router.delete(
  "/:id",
  organizationController.deleteOrganization.bind(organizationController)
);
export default router;
