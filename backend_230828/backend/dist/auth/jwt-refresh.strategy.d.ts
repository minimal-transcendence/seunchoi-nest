import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from './types';
declare const JwtRefreshStrategy_base: new (...args: any[]) => any;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(req: Request, payload: any): Promise<JwtPayload>;
}
export {};
