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
exports.TwoFactorAuthService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const user_service_1 = require("../user/user.service");
let TwoFactorAuthService = exports.TwoFactorAuthService = class TwoFactorAuthService {
    constructor(userService) {
        this.userService = userService;
    }
    async generateQrCode(stream, user) {
        if (user.otpSecret) {
            return stream.send({
                message: 'you already have otp secret',
            });
        }
        const secret = otplib_1.authenticator.generateSecret();
        this.userService.updateUserById(user.id, {
            otpSecret: secret,
        });
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.email, 'seunchoi-2fa', secret);
        return (0, qrcode_1.toFileStream)(stream, otpAuthUrl);
    }
    async isTwoFactorAuthCodeValid(twoFactorAuthCode, user) {
        if (!user.otpSecret) {
            return false;
        }
        return otplib_1.authenticator.verify({
            token: twoFactorAuthCode,
            secret: user.otpSecret,
        });
    }
};
exports.TwoFactorAuthService = TwoFactorAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], TwoFactorAuthService);
//# sourceMappingURL=two-factor-auth.service.js.map