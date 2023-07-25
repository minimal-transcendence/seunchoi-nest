import { ConsoleLogger, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { FortyTwoAuthGuard } from './42-auth.guard';
import { JwtGuard } from './42-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async getLogin(@Req() req) {
        return 'success'
    }

    @UseGuards(FortyTwoAuthGuard)
    @Get('callback')
    async getCallback(@Req() req, @Res() res) {
        // console.log(req.user.id, req.user.login);
        console.log(req.user.access_token);
        res.setHeader('Authorization', 'Bearer '+req.user.access_token);
        res.cookie('jwt', req.user.access_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.redirect('/');
        // return res.send({
        //     message: 'success'
        // });
    }

    //todo - JwtGuard 실패 시 /auth/login 페이지로 리다이렉트 (UseFilter??)
    @UseGuards(JwtGuard)
    @Get('test')
    getTest(@Req() req) {
        return 'test success!!'
    }
}
