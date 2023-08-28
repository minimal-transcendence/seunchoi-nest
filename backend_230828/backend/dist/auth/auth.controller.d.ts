import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: any, code: string, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
