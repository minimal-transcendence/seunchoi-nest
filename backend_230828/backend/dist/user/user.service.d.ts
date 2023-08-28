/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { ChatGateway } from 'src/chat/chat.gateway';
export declare class UserService {
    private readonly prisma;
    private readonly chatGateway;
    constructor(prisma: PrismaService, chatGateway: ChatGateway);
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    findUserById(userId: number): Promise<any | undefined>;
    getAllUser(): Promise<object[]>;
    getUserById(id: number): Promise<object>;
    updateUserById(id: number, data: Prisma.UserUpdateInput, file?: Express.Multer.File): Promise<{
        id: number;
        nickname: string;
        email: string;
        avatar: string;
        score: number;
        createdAt: Date;
        lastLogin: Date;
        friends: number[];
        refreshToken: string;
        tokenExp: number;
        otpSecret: string;
        is2faEnabled: boolean;
    } | {
        error: string;
        code?: undefined;
    } | {
        code: any;
        error: any;
    }>;
    getUserFriendsListById(id: number): Promise<object>;
    getUserFriendsById(id: number): Promise<object>;
    updateFriendsById(id: number, data: {
        friend: number;
        isAdd: boolean;
    }): Promise<object>;
    getUserMatchHistoryById(id: number): Promise<object[]>;
    getUserImageById(id: number): Promise<StreamableFile>;
}
