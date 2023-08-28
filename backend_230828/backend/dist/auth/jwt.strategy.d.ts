import { UserService } from 'src/user/user.service';
import { JwtPayload } from './types';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<JwtPayload>;
}
export {};
