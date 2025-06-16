"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getUserById = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    createUser = async (req, res) => {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    updateUser = async (req, res) => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    deleteUser = async (req, res) => {
        try {
            const success = await this.userService.deleteUser(req.params.id);
            if (success) {
                res.status(204).send();
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map