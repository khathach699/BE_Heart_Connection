import { Router } from "express";
import StateController from "../controllers/stateController";
const router = Router();
router.post("/", StateController.createState.bind(StateController)); 
router.get("/", StateController.getAllStates.bind(StateController)); 
router.get("/:id", StateController.getStateById.bind(StateController)); 
router.put("/:id", StateController.updateState.bind(StateController));
router.delete("/:id", StateController.deleteState.bind(StateController));
export default router;
