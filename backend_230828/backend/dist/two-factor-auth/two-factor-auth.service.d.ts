import { Response } from 'express';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
export declare class TwoFactorAuthService {
    private userService;
    constructor(userService: UserService);
    generateQrCode(stream: Response, user: User): Promise<any>;
    isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User): Promise<boolean>;
}
