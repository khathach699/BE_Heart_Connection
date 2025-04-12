import { Router } from "express";
import StateController from "../controllers/stateController";
const router = Router();
router.post("/", StateController.createState as unknown as any); 
router.get("/", StateController.getAllStates as unknown as any); 
router.get("/:id", StateController.getStateById as unknown as any); 
router.put("/:id", StateController.updateState as unknown as any);
router.delete("/:id", StateController.deleteState as unknown as any);
export default router;
