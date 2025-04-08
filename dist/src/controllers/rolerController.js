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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRole = void 0;
const roleService_1 = require("../services/roleService");
const responnseHandler_1 = require("../utils/responnseHandler");
const CreateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const role = yield (0, roleService_1.CreateARole)(name);
        return (0, responnseHandler_1.CreateSuccessResponse)(res, 201, role);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Role creation failed";
        return (0, responnseHandler_1.CreateErrorResponse)(res, 500, errorMessage);
    }
});
exports.CreateRole = CreateRole;
//# sourceMappingURL=rolerController.js.map