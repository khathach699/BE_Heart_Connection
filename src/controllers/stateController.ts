import { Request, Response } from "express";
import { IState } from "../types/State";
import stateService from "../services/stateService";
import { CreateSuccessResponse, CreateErrorResponse } from "../utils/responnseHandler";

export class StateController {
    async createState(req: Request, res: Response) {
        try {
            const stateData: IState = req.body;
            const newState = await stateService.createState(stateData);
            return CreateSuccessResponse(res, 201, newState);
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async getAllStates(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await stateService.getAllStates(page, limit);
            return CreateSuccessResponse(res, 200, result);
        } catch (error) {
            return CreateErrorResponse(res, 500, (error as Error).message);
        }
    }

    async getStateById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const state = await stateService.getStateById(id);
            return CreateSuccessResponse(res, 200, state);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }

    async updateState(req: Request, res: Response) {
        try {
            const id = req.params.id; // Extract id from params
            const state = await stateService.updateState(id, req.body as Partial<IState>);
            return CreateSuccessResponse(res, 200, { message: "State updated successfully", state });
        } catch (error) {
            return CreateErrorResponse(res, 400, (error as Error).message);
        }
    }

    async deleteState(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteState = await stateService.deleteState(id);
            return CreateSuccessResponse(res, 200, deleteState);
        } catch (error) {
            return CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new StateController();