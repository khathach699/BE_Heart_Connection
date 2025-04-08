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
exports.RoleController = void 0;
const roleService_1 = __importDefault(require("../services/roleService"));
class RoleController {
    getAllRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleService_1.default.getAllRoles();
                res.status(200).json(roles);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    createRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = req.body;
                const newRole = yield roleService_1.default.createRole(role);
                res.status(201).json(newRole);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.RoleController = RoleController;
exports.default = new RoleController();
//# sourceMappingURL=roleController.js.map