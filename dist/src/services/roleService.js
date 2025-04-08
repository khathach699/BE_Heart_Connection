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
exports.CreateARole = exports.RoleService = void 0;
const Role_1 = __importDefault(require("../schemas/Role"));
class RoleService {
    getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return Role_1.default.find({ isdeleted: false });
        });
    }
    createRole(roleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRole = new Role_1.default(roleData);
                return newRole.save();
            }
            catch (error) {
                throw new Error(`Error creating user: ${error.message}`);
            }
        });
    }
}
exports.RoleService = RoleService;
const CreateARole = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let newRole = new Role_1.default({
        name: name,
    });
    return yield newRole.save();
});
exports.CreateARole = CreateARole;
exports.default = new RoleService();
//# sourceMappingURL=roleService.js.map