"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    users = [];
    async getAllUsers() {
        return this.users;
    }
    async getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    async createUser(userData) {
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            ...userData
        };
        this.users.push(newUser);
        return newUser;
    }
    async updateUser(id, userData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return undefined;
        this.users[index] = { ...this.users[index], ...userData };
        return this.users[index];
    }
    async deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map