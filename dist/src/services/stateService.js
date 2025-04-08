"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const State_1 = __importDefault(require("../schemas/State"));
class StateService {
    getAllStates() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, isAccepted) {
            try {
                const options = {
                    page,
                    limit,
                    sort: { createdAt: -1 },
                };
                const query = { isdeleted: false };
                const result = yield State_1.default.paginate(query, options);
                return {
                    states: result.docs,
                    total: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                };
            }
            catch (error) {
                throw new Error(`Error fetching states: ${error.message}`);
            }
        });
    }
    getStateById(state_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.findOne({ _id: state_id, isdeleted: false });
                if (!state)
                    throw new Error("State not found");
                return state;
            }
            catch (error) {
                throw new Error(`Error fetching state: ${error.message}`);
            }
        });
    }
    createState(stateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newState = new State_1.default(stateData);
                const existingState = yield State_1.default.findOne({ name: stateData.name });
                if (existingState)
                    throw new Error("State already exists");
                return yield newState.save();
            }
            catch (error) {
                throw new Error(`Error creating state: ${error.message}`);
            }
        });
    }
    updateState(id, stateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.findOneAndUpdate({ _id: id, isdeleted: false }, stateData, { new: true });
                if (!state)
                    throw new Error("State not found");
                return state;
            }
            catch (error) {
                throw new Error(`Error updating state: ${error.message}`);
            }
        });
    }
    deleteState(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = yield State_1.default.findOneAndUpdate({ _id: id, isdeleted: false }, { isdeleted: true }, { new: true });
                if (!state)
                    throw new Error("State not found");
                return state;
            }
            catch (error) {
                throw new Error(`Error deleting state: ${error.message}`);
            }
        });
    }
}
exports.StateService = StateService;
exports.default = new StateService();
//# sourceMappingURL=stateService.js.map