/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUser(): Promise<object[]>;
    getOneUser(id: number): Promise<object>;
    updateUserAvatar(req: any, id: number, file: Express.Multer.File, data: Prisma.UserUpdateInput): Promise<any>;
    updateUser(id: number, data: Prisma.UserUpdateInput): Promise<Object>;
    getUserFriends(id: number): Promise<object>;
    updateUserFriends(req: any, id: number, data: {
        friend: number;
        isAdd: boolean;
    }): Promise<object>;
    getUserMatchHistory(id: number): Promise<object[]>;
}
export declare class avatarController {
    private readonly userService;
    constructor(userService: UserService);
    getAvatar(img: string): StreamableFile;
}
