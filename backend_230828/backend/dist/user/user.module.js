"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const prisma_service_1 = require("../prisma.service");
const user_controller_1 = require("./user.controller");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const chat_module_1 = require("../chat/chat.module");
const store_module_1 = require("../chat/store/store.module");
const jwt_1 = require("@nestjs/jwt");
const chat_gateway_1 = require("../chat/chat.gateway");
const chat_service_1 = require("../chat/chat.service");
let UserModule = exports.UserModule = class UserModule {
};
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            chat_module_1.ChatModule,
            store_module_1.StoreModule,
            jwt_1.JwtModule
        ],
        controllers: [user_controller_1.UserController, user_controller_1.avatarController],
        providers: [
            user_service_1.UserService,
            prisma_service_1.PrismaService,
            jwt_guard_1.JwtGuard,
            chat_gateway_1.ChatGateway,
            chat_service_1.ChatService
        ],
        exports: [user_service_1.UserService]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map