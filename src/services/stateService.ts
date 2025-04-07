import Campaign from "../schemas/Campaign";
import State from "../schemas/State";
import { IState, IStateDocument } from "../types/State";

export class StateService {
    async getAllStates(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
            };

            const query: any = { isdeleted: false };
            const result = await State.paginate(query, options);
            return {
                states: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching states: ${(error as Error).message}`);
        }
    }
    async getStateById(state_id: string): Promise<IStateDocument> {
        try {
            const state = await State.findOne({ _id: state_id, isdeleted: false });
            if (!state) throw new Error("State not found");
            return state;
        } catch (error) {
            throw new Error(`Error fetching state: ${(error as Error).message}`);
        }
    }
    async createState(stateData: IState): Promise<IStateDocument> {
        try {
            const newState = new State(stateData);
            const existingState = await State.findOne({ name: stateData.name });
            if (existingState) throw new Error("State already exists");
            return await newState.save();
        } catch (error) {
            throw new Error(`Error creating state: ${(error as Error).message}`);
        }
    }
    async updateState(id: string, stateData: Partial<IState>): Promise<IStateDocument> {
        try {
            const state = await State.findOneAndUpdate(
                { _id: id, isdeleted: false },
                stateData,
                { new: true }
            );
            if (!state) throw new Error("State not found");
            return state;
        } catch (error) {
            throw new Error(`Error updating state: ${(error as Error).message}`);
        }
    }
     async deleteState(id: string): Promise<IStateDocument> {
        try {
            const state = await State.findOneAndUpdate(
                { _id: id, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!state) throw new Error("State not found");
            return state;
        } catch (error) {
            throw new Error(`Error deleting state: ${(error as Error).message}`);
        }
    }
}

export default new StateService();