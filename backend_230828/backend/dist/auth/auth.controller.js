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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_refresh_guard_1 = require("./guards/jwt-refresh.guard");
const user_service_1 = require("../user/user.service");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(req, code, res) {
        if (!code) {
            throw new common_1.UnauthorizedException('No code in query string');
        }
        console.log("Nest code:", code);
        const apiData = await this.authService.getUserFromApi(code);
        const user = await this.userService.createUser({
            id: apiData.id,
            email: apiData.email,
        });
        if (user.is2faEnabled) {
            return res.send({
                message: 'you must authenticate 2fa to get jwt token.',
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                is2faEnabled: true,
            });
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
        res.cookie('access_token', access_token, {
            httpOnly: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
        });
        return res.send({
            message: 'new jwt generated',
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            is2faEnabled: false,
            access_token: access_token
        });
    }
    async refresh(req, res) {
        console.log(req);
        const user = await this.userService.findUserById(req.user.id);
        const access_token = await this.authService.generateAccessToken({
            id: user.id,
            email: user.email,
        });
        res.setHeader('Authorization', 'Bearer ' + access_token);
        res.cookie('access_token', access_token, {
            httpOnly: true,
        });
        return res.send({
            message: 'generate new access token',
            access_token: access_token,
            access_token_exp: process.env.JWT_ACCESS_EXPIRATION_TIME,
        });
    }
    async logout(req, res) {
        await this.userService.updateUserById(req.user.id, {
            refreshToken: null,
        });
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.send({
            message: 'logout success'
        });
    }
};
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshGuard),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map