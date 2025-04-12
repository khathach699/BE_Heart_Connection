import { Request, Response } from "express";
import { IState } from "../types/State";
import stateService from "../services/stateService";
import { CreateErrorResponse, CreateSuccessResponse } from "../utils/responnseHandler";
export class StateController {
    async createState(req: Request, res: Response) {
        try {
            console.log(req.body);
            const stateData: IState = req.body;
            const newState = await stateService.createState(stateData);
            CreateSuccessResponse(res, 201, newState);
        } catch (error) {
            CreateErrorResponse(res, 400, (error as Error).message);
        }
    }
    async getAllStates(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await stateService.getAllStates(page, limit);
            CreateSuccessResponse(res, 200, result);
        } catch (error) {
            CreateErrorResponse(res, 500, (error as Error).message);
        }
    }
    async getStateById(req: Request, res: Response) {
        try {
            const id = req.params.id; 
            const state = await stateService.getStateById(id);
            CreateSuccessResponse(res, 200, state);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async updateState(req: Request, res: Response) {
        try {
            const id = req.params.id; // Extract id from params
            const state = await stateService.updateState(id, req.body as Partial<IState>);
            CreateSuccessResponse(res, 200, state);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
    async deleteState(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const deleteState = await stateService.deleteState(id);
            CreateSuccessResponse(res, 200, deleteState);
        } catch (error) {
            CreateErrorResponse(res, 404, (error as Error).message);
        }
    }
}
export default new StateController();