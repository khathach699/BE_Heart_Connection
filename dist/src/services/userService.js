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
exports.UserService = void 0;
const User_1 = __importDefault(require("../schemas/User"));
class UserService {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new User_1.default(userData);
                return yield newUser.save();
            }
            catch (error) {
                throw new Error(`Error creating user: ${error.message}`);
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_1.default.find({ isdeleted: false });
            }
            catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ _id: id, isdeleted: false });
                if (!user)
                    throw new Error("User not found");
                return user;
            }
            catch (error) {
                throw new Error(`Error fetching user: ${error.message}`);
            }
        });
    }
    updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOneAndUpdate({ _id: id, isdeleted: false }, userData, { new: true });
                if (!user)
                    throw new Error("User not found");
                return user;
            }
            catch (error) {
                throw new Error(`Error updating user: ${error.message}`);
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOneAndUpdate({ _id: id, isdeleted: false }, { isdeleted: true }, { new: true });
                if (!user)
                    throw new Error("User not found");
                return user;
            }
            catch (error) {
                throw new Error(`Error deleting user: ${error.message}`);
            }
        });
    }
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=userService.js.map