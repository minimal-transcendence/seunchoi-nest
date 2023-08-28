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
exports.avatarController = exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const client_1 = require("@prisma/client");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const fs_1 = require("fs");
let UserController = exports.UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getAllUser() {
        return (this.userService.getAllUser());
    }
    getOneUser(id) {
        return (this.userService.getUserById(id));
    }
    async updateUserAvatar(req, id, file, data) {
        if (req.user.id != id)
            throw new common_1.HttpException("unauthorized action", common_1.HttpStatus.BAD_REQUEST);
        return this.userService.updateUserById(id, data, file);
    }
    async updateUser(id, data) {
        return this.userService.updateUserById(id, data);
    }
    async getUserFriends(id) {
        return this.userService.getUserFriendsById(id);
    }
    updateUserFriends(req, id, data) {
        if (req.user.id != id)
            throw new common_1.HttpException("unauthorized action", common_1.HttpStatus.BAD_REQUEST);
        return this.userService.updateFriendsById(id, data);
    }
    async getUserMatchHistory(id) {
        return this.userService.getUserMatchHistoryById(id);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOneUser", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        dest: 'app/photo',
    })),
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: '.(jpeg|jpg|png|gif)',
    })
        .build({
        fileIsRequired: true
    }))),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserAvatar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)(':id/friend'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserFriends", null);
__decorate([
    (0, common_1.Patch)(':id/friend'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserFriends", null);
__decorate([
    (0, common_1.Get)(':id/matchhistory'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserMatchHistory", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
let avatarController = exports.avatarController = class avatarController {
    constructor(userService) {
        this.userService = userService;
    }
    getAvatar(img) {
        const file = (0, fs_1.createReadStream)((0, path_1.join)('app/photo/' + img));
        return new common_1.StreamableFile(file);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('img')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", common_1.StreamableFile)
], avatarController.prototype, "getAvatar", null);
exports.avatarController = avatarController = __decorate([
    (0, common_1.Controller)('app/photo/:img'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], avatarController);
//# sourceMappingURL=user.controller.js.map