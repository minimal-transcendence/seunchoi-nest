import { Controller, Get, Next, Post, Body, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/42.guard';
import { JwtGuard } from './guards/jwt.guard';
import { NextFunction, Response } from 'express';
// import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async getLogin(@Next() next: NextFunction) {
        next();
    }

    @UseGuards(FortyTwoAuthGuard)
    @Get('callback')
    async getCallback(
        @Req() req: any, @Res() res: Response) {
        const access_token = req.user.access_token;
        const refresh_token = req.user.refresh_token;

        res.setHeader('Authorization', 'Bearer '+ [access_token, refresh_token]);
        res.cookie('access_token', access_token, {
            httpOnly: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
        });

        return res.send({
            message: 'success'
        });
    }

    @UseGuards(JwtRefreshGuard)
    //@Post('refresh')
    @Get('refresh')
    async refresh(@Req() req: any, @Res() res: Response) {
        const user = req.user;
        const access_token = await this.authService.generateAccessToken(user);
        res.setHeader('Authorization', 'Bearer '+ access_token);
        res.cookie('access_token', access_token, {
            httpOnly: true,
        });
        return res.send({
            message: 'generate new access token'
        });
    }

    @UseGuards(JwtRefreshGuard)
    // @Post('logout')
    @Get('logout')
    async logout(@Req() req: any, @Res() res: Response): Promise<any> {
        await this.usersService.removeRefreshToken(req.user.id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.send({
            message: 'logout success'
        });
    }

    //todo - JwtGuard 실패 시 /auth/login 페이지로 리다이렉트 (UseFilter??)
    // 위 처럼 처리하는 것이 바람직하지 않을 수 있음
    @UseGuards(JwtGuard)
    @Get('test')
    getTest(@Req() req) {

        return req.user; // req.user of JwtGuard
    }
}