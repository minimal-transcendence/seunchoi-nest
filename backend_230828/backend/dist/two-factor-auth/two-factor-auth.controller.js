"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const _2fa_code_dto_1 = require("../dto/2fa-code.dto");
const two_factor_auth_service_1 = require("./two-factor-auth.service");
const user_service_1 = require("../user/user.service");
let TwoFactorAuthController = exports.TwoFactorAuthController = class TwoFactorAuthController {
    constructor(authService, twoFactorAuthService, userService) {
        this.authService = authService;
        this.twoFactorAuthService = twoFactorAuthService;
        this.userService = userService;
    }
    async authenticate(req, res, twoFactorAuthCode) {
        const user = await this.userService.findUserById(twoFactorAuthCode.id);
        if (!user) {
            throw new common_1.UnauthorizedException('No user in database');
        }
        const isCodeValidated = await this.twoFactorAuthService.isTwoFactorAuthCodeValid(twoFactorAuthCode.twoFactorAuthCode, user);
        if (!isCodeValidated) {
            throw new common_1.UnauthorizedException('Invalid otp code');
        }
        const access_token = await this.authService.generateAccessToken({
            id: user.id,
            email: user.email
        });
        const refresh_token = await this.authService.generateRefreshToken({
            id: user.id,
            email: user.email
        });
        const hashedRefreshToken = await this.authService.getHashedRefreshToken(refresh_token);
        this.userService.updateUserById(user.id, {
            refreshToken: hashedRefreshToken
        });
        res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
        res.clearCookie('id');
        res.cookie('access_token', access_token, {
            httpOnly: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
        });
        return res.send({
            message: 'new jwt generated',
            access_token: access_token,
        });
    }
    async getQrCode(req, res) {
        const user = req.user;
        return await this.twoFactorAuthService.generateQrCode(res, user);
    }
    async testOn(req) {
        const user = req.user;
        this.userService.updateUserById(user.id, {
            is2faEnabled: true,
        });
        return { message: '2fa turn on' };
    }
    async twoFactorAuthOn(req, twoFactorAuthCode) {
        const user = req.user;
        const isCodeValidated = await this.twoFactorAuthService.isTwoFactorAuthCodeValid(twoFactorAuthCode.twoFactorAuthCode, user);
        if (!isCodeValidated) {
            throw new common_1.UnauthorizedException('Invalid otp code');
        }
        this.userService.updateUserById(user.id, {
            is2faEnabled: true,
        });
        return { message: '2fa turn on' };
    }
    async twoFactorAuthOff(req, twoFactorAuthCode) {
        const user = req.user;
        const isCodeValidated = await this.twoFactorAuthService.isTwoFactorAuthCodeValid(twoFactorAuthCode.twoFactorAuthCode, user);
        if (!isCodeValidated) {
            throw new common_1.UnauthorizedException('Invalid otp code');
        }
        this.userService.updateUserById(user.id, {
            is2faEnabled: false,
        });
        return { message: '2fa turn off' };
    }
};
__decorate([
    (0, common_1.Post)('authenticate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, _2fa_code_dto_1.TwoFactorAuthCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "authenticate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('qrcode'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "getQrCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('test-turn-on'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "testOn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('turn-on'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, _2fa_code_dto_1.TwoFactorAuthCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "twoFactorAuthOn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('turn-off'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, _2fa_code_dto_1.TwoFactorAuthCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthController.prototype, "twoFactorAuthOff", null);
exports.TwoFactorAuthController = TwoFactorAuthController = __decorate([
    (0, common_1.Controller)('2fa'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        two_factor_auth_service_1.TwoFactorAuthService,
        user_service_1.UserService])
], TwoFactorAuthController);
//# sourceMappingURL=two-factor-auth.controller.js.map