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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
const user_service_1 = require("../user/user.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(jwtService, userService, httpService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.httpService = httpService;
    }
    async getUserFromApi(code) {
        const tokenReq = this.httpService.post("https://api.intra.42.fr/oauth/token", {
            grant_type: process.env.FT_GRANT_TYPE,
            code: code,
            client_id: process.env.FT_CLIENT_ID,
            client_secret: process.env.FT_CLIENT_SECRET,
            redirect_uri: process.env.FT_REDIRECT_URI,
            scope: "public",
        });
        const tokenData = await (0, rxjs_1.lastValueFrom)(tokenReq);
        const access_token = tokenData.data.access_token;
        const userReq = this.httpService.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const userData = await (0, rxjs_1.lastValueFrom)(userReq);
        return userData.data;
    }
    async generateAccessToken(payload) {
        return await this.jwtService.signAsync({
            id: payload.id,
            email: payload.email,
        });
    }
    async generateRefreshToken(payload) {
        return await this.jwtService.signAsync({
            id: payload.id,
            email: payload.email
        }, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
        });
    }
    async getHashedRefreshToken(refreshToken) {
        const signatue = refreshToken.split('.')[2];
        const saltOrRounds = 10;
        const hashedRefreshToken = await bcrypt.hash(signatue, saltOrRounds);
        return hashedRefreshToken;
    }
    async getUserIfRefreshTokenMatches(refreshToken, userId) {
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("no such user in database");
        }
        if (!user.refreshToken) {
            throw new common_1.UnauthorizedException("no refresh token on user");
        }
        const signatue = refreshToken.split('.')[2];
        const isMatched = await bcrypt.compare(signatue, user.refreshToken);
        if (isMatched) {
            return user;
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map