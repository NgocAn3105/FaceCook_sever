"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
exports.router = express_1.default.Router();
const userController = new user_controller_1.UserController();
exports.router.get('/', userController.getAllUsers);
exports.router.get('/:id', userController.getUserById);
exports.router.post('/', userController.createUser);
exports.router.put('/:id', userController.updateUser);
exports.router.delete('/:id', userController.deleteUser);
//# sourceMappingURL=user.routes.js.map