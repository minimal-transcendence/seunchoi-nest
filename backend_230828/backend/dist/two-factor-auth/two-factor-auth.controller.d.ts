import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { TwoFactorAuthCodeDto } from 'src/dto/2fa-code.dto';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { UserService } from 'src/user/user.service';
export declare class TwoFactorAuthController {
    private authService;
    private twoFactorAuthService;
    private userService;
    constructor(authService: AuthService, twoFactorAuthService: TwoFactorAuthService, userService: UserService);
    authenticate(req: Request, res: Response, twoFactorAuthCode: TwoFactorAuthCodeDto): Promise<Response<any, Record<string, any>>>;
    getQrCode(req: any, res: Response): Promise<any>;
    testOn(req: any): Promise<{
        message: string;
    }>;
    twoFactorAuthOn(req: any, twoFactorAuthCode: TwoFactorAuthCodeDto): Promise<{
        message: string;
    }>;
    twoFactorAuthOff(req: any, twoFactorAuthCode: TwoFactorAuthCodeDto): Promise<{
        message: string;
    }>;
}
