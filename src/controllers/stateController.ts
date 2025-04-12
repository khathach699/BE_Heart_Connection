import { Request, Response } from "express";
import { IState } from "../types/State";
import stateService from "../services/stateService";
import {
  CreateSuccessResponse,
  CreateErrorResponse,
} from "../utils/responnseHandler";

export class StateController {
  async createState(req: Request, res: Response) {
    try {
      const stateData: IState = req.body;
      const newState = await stateService.createState(stateData);
      res.json(newState);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async getAllStates(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await stateService.getAllStates(page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async getStateById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const state = await stateService.getStateById(id);
      res.status(200).json(state);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
  async updateState(req: Request, res: Response) {
    try {
      const id = req.params.id; // Extract id from params
      const state = await stateService.updateState(
        id,
        req.body as Partial<IState>
      );
      res.status(200).json({ message: "State updated successfully", state });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  async deleteState(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deleteState = await stateService.deleteState(id);
      res.status(200).json(deleteState);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
}
export default new StateController();
