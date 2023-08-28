import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { JwtPayload } from './types';
export declare class AuthService {
    private jwtService;
    private userService;
    private httpService;
    constructor(jwtService: JwtService, userService: UserService, httpService: HttpService);
    getUserFromApi(code: string): Promise<any>;
    generateAccessToken(payload: JwtPayload): Promise<string>;
    generateRefreshToken(payload: JwtPayload): Promise<string>;
    getHashedRefreshToken(refreshToken: string): Promise<any>;
    getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User>;
}
