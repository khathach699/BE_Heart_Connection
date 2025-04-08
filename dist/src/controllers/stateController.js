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
exports.StateController = void 0;
const stateService_1 = __importDefault(require("../services/stateService"));
class StateController {
    createState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const stateData = req.body;
                const newState = yield stateService_1.default.createState(stateData);
                res.json(newState);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getAllStates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield stateService_1.default.getAllStates(page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getStateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const state = yield stateService_1.default.getStateById(id);
                res.status(200).json(state);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    updateState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id; // Extract id from params
                const state = yield stateService_1.default.updateState(id, req.body);
                res.status(200).json({ message: "State updated successfully", state });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const deleteState = yield stateService_1.default.deleteState(id);
                res.status(200).json(deleteState);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
}
exports.StateController = StateController;
exports.default = new StateController();
//# sourceMappingURL=stateController.js.map