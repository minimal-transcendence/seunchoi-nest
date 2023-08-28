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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const path_1 = require("path");
const fs_1 = require("fs");
const chat_gateway_1 = require("../chat/chat.gateway");
let UserService = exports.UserService = class UserService {
    constructor(prisma, chatGateway) {
        this.prisma = prisma;
        this.chatGateway = chatGateway;
    }
    async createUser(data) {
        while (!data.nickname) {
            data.nickname = `user_${Math.floor(Math.random() * 1000)}`;
            const isUnique = await this.prisma.user.findUnique({
                where: { nickname: data.nickname },
                select: { nickname: true }
            });
            if (isUnique)
                data.nickname = null;
        }
        return await this.prisma.user.upsert({
            where: {
                id: data.id,
            },
            update: {},
            create: {
                id: data.id,
                nickname: data.nickname,
                email: data.email
            }
        });
    }
    async findUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    }
    async getAllUser() {
        const res = await this.prisma.user.findMany({
            select: {
                id: true,
                nickname: true,
                avatar: true,
                score: true,
                lastLogin: true
            },
            orderBy: { lastLogin: 'desc' }
        });
        return (res);
    }
    async getUserById(id) {
        return await this.prisma.user.findUniqueOrThrow({
            where: { id: id },
            select: {
                id: true,
                nickname: true,
                email: true,
                avatar: true,
                score: true,
                lastLogin: true,
                _count: {
                    select: {
                        asWinner: true,
                        asLoser: true,
                    }
                }
            }
        }).then((res) => {
            return (res);
        })
            .catch((error) => {
            return { message: 'An error occurred', error: error.message };
        });
    }
    async updateUserById(id, data, file) {
        return await this.prisma.user.update({
            where: { id: id },
            data: {
                ...data,
                id: undefined,
                friends: undefined,
                avatar: file != null ? file.path.toString() : undefined,
            }
        }).then((res) => {
            if (file) {
                this.chatGateway.userUpdateAvatar(id);
            }
            if (data.nickname) {
                this.chatGateway.userUpdateNick(id, data.nickname);
            }
            return (res);
        }).catch((error) => {
            if (error instanceof client_1.Prisma.PrismaClientValidationError) {
                return { error: "Validation Error" };
            }
            else
                return { code: error.code, error: error.message };
        });
    }
    async getUserFriendsListById(id) {
        return await this.prisma.user.findUniqueOrThrow({
            where: { id: id }
        })
            .then((res) => { return res.friends; })
            .catch((error) => {
            return { message: '', error: error.message };
        });
    }
    async getUserFriendsById(id) {
        return this.prisma.user.findUniqueOrThrow({
            where: { id: id },
        })
            .then((user) => {
            return Promise.all(user.friends.map((element) => {
                return this.getUserById(element);
            }));
        })
            .then((friendList) => {
            return { friendList };
        })
            .catch((error) => {
            return { message: '', error: error.message };
        });
    }
    async updateFriendsById(id, data) {
        if (id == data.friend)
            throw new common_1.HttpException("I am a good friend of myself...", common_1.HttpStatus.BAD_REQUEST);
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id },
            select: { friends: true }
        });
        if (data.isAdd == true) {
            await this.prisma.user.findUniqueOrThrow({
                where: { id: data.friend },
            });
            if (user.friends.includes(data.friend))
                throw new common_1.HttpException("Already In!", common_1.HttpStatus.BAD_REQUEST);
            return this.prisma.user.update({
                where: { id },
                data: {
                    friends: {
                        push: data.friend,
                    }
                }
            });
        }
        else {
            if (!user.friends.includes(data.friend))
                throw new common_1.HttpException("Not in the list", common_1.HttpStatus.BAD_REQUEST);
            return await this.prisma.user.update({
                where: { id },
                data: {
                    friends: {
                        set: user.friends.filter((num) => num !== data.friend),
                    }
                }
            });
        }
    }
    async getUserMatchHistoryById(id) {
        return this.prisma.matchHistory.findMany({
            where: {
                OR: [{ winnerId: id }, { loserId: id }]
            },
            select: {
                winner: {
                    select: {
                        nickname: true,
                        avatar: true
                    }
                },
                loser: {
                    select: {
                        nickname: true,
                        avatar: true
                    }
                },
                createdTime: true
            },
            orderBy: { createdTime: 'desc' }
        });
    }
    async getUserImageById(id) {
        const fileName = await this.prisma.user.findUnique({
            where: { id },
            select: { avatar: true },
        }).then((res) => { return res.avatar; });
        if (!fileName)
            return null;
        console.log('app/photo/' + fileName);
        const file = (0, fs_1.createReadStream)((0, path_1.join)('app/photo/' + fileName));
        return new common_1.StreamableFile(file);
    }
};
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_gateway_1.ChatGateway])
], UserService);
//# sourceMappingURL=user.service.js.map