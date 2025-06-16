"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./user.routes");
exports.router = express_1.default.Router();
exports.router.use('/users', user_routes_1.router);
// Health check route
exports.router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
//# sourceMappingURL=index.js.map