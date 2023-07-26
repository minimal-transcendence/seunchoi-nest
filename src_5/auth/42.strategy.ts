import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

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
            const found = await this.usersService.findUserById(data.id);
            if (found) {
                return found;
            }

            const user: User = {
                id: data.id,
                username: data.login,
                email: data.email,
                is2faEnabled: false,
                twoFactorAuthSecret: null,
                refreshToken: null,
            };
            this.usersService.newUser(user);

            return user;
        } catch (error) {}

        throw new UnauthorizedException();
    }
}