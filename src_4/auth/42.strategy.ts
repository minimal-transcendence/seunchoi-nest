import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
        private httpService: HttpService,
        private authService: AuthService,
        private usersService: UsersService,
        ) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: 'u-s4t2ud-b473c8cce72cb20ef0a0f987531382de1f8be655edb0b5b8472973eec8f8de06',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/callback',
        });
    }

    async validate(accessToken: string, refreshToken: string) {
        console.log('42API accessToken: ', accessToken);
        console.log('42API refreshToken: ', refreshToken);
        // db에 저장??

        // req is Observable
        const req = this.httpService.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        try {
            const { data } = await lastValueFrom(req);

            // 2fa secret gen
            const tfa = await this.authService.generateTwoFactorAuthenticationSecret(data.email);
            console.log(tfa.otpAuthUrl);
            //JWT gen
            // const user = { id: data.id, username: data.login };
            // const access_token = await this.authService.generateAccessToken(user);
            // const refresh_token = await this.authService.generateRefreshToken(user);

            // todo - current refresh_token DB에 저장 - hash로 저장
            // 만료시간도 저장
            const currentDate = new Date();

            console.log(currentDate.getTime());
            // const currentRefreshTokenExp = new Date(currentDate.getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')));
            this.usersService.newUser({
                id: data.id,
                username: data.login,
                email: data.email,
                twoFactorAuthenricationSecret: tfa.secret,
                refreshToken: null,
            });

            // Return - Request 객체에 담겨짐 (req.user)
            // return {
            //     message: 'login success',
            //     access_token: access_token,
            //     refresh_token: refresh_token,
            // }
            return {
                email: data.email,
                otpAuthUrl: tfa.otpAuthUrl
            };
        } catch (error) {}

        throw new UnauthorizedException();
    }
}