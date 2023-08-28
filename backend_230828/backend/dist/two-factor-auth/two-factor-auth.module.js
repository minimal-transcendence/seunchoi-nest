"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthModule = void 0;
const common_1 = require("@nestjs/common");
const two_factor_auth_service_1 = require("./two-factor-auth.service");
const two_factor_auth_controller_1 = require("./two-factor-auth.controller");
const auth_service_1 = require("../auth/auth.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_service_1 = require("../prisma.service");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const chat_module_1 = require("../chat/chat.module");
let TwoFactorAuthModule = exports.TwoFactorAuthModule = class TwoFactorAuthModule {
};
exports.TwoFactorAuthModule = TwoFactorAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            axios_1.HttpModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                signOptions: {
                    expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
                },
            }),
            chat_module_1.ChatModule
        ],
        providers: [
            two_factor_auth_service_1.TwoFactorAuthService,
            auth_service_1.AuthService,
            user_service_1.UserService,
            prisma_service_1.PrismaService,
        ],
        controllers: [two_factor_auth_controller_1.TwoFactorAuthController],
        exports: [two_factor_auth_service_1.TwoFactorAuthService]
    })
], TwoFactorAuthModule);
//# sourceMappingURL=two-factor-auth.module.js.map