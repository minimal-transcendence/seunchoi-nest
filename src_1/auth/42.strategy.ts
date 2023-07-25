import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private http: HttpService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: 'u-s4t2ud-b473c8cce72cb20ef0a0f987531382de1f8be655edb0b5b8472973eec8f8de06',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/callback'
        });
    }

    async validate(accessToken: string, refreshToken: string) {
        console.log('accessToken: ', accessToken);
        console.log('refreshToken: ', refreshToken);
        // store in db

        // req is Observable
        const req = this.http.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        try {
            const { data } = await lastValueFrom(req);
            // console.log('login:', data.login);

            // return된 data는 callbackURL의 request객체(req.user)에 담김
            return data;
        } catch (error) {}

        throw new UnauthorizedException();
    }
}