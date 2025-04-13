import { Router } from "express";
import organizationController from "../controllers/organizationController";
import { check_authentication } from "../utils/check_auth";
import multer from "multer";
import path from "path";

const router = Router();
const avatarDir: string = path.join(__dirname, "../images");
//Sua them anh
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, avatarDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Chỉ nhận file ảnh!"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
//Sua them anh
router.post("/request", check_authentication, upload.array("certificate", 1) ,organizationController.requestUpgradeToOrganization as unknown as any); 
router.put("/approve/:id",organizationController.approveOrganization as unknown as any);
router.put("/reject/:id",organizationController.rejectOrganization as unknown as any);
router.get("/", organizationController.getAllOrganizations as unknown as any);
router.get("/trash",organizationController.getAllOrganizationsWasReject as unknown as any);
router.get("/:id",organizationController.getOrganizationById as unknown as any);
router.delete("/:id",organizationController.deleteOrganization as unknown as any);

export default router;
