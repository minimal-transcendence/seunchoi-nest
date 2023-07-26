import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private usersService: UsersService
    ) {}

    async getOtpUrl(user: User): Promise<string> {
        let secret = user.twoFactorAuthSecret;

        if (!secret) {
            secret = authenticator.generateSecret();

            // db에 secret 저장
            this.usersService.setTwoFactorAuthSecret(user, secret);
        }
        const otpAuthUrl = authenticator.keyuri(user.email, 'seunchoi-2fa', secret);
        return otpAuthUrl;
    }

    async pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<void> {
        return toFileStream(stream, otpAuthUrl);
    }

    async isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
        if(!user.twoFactorAuthSecret) {
            return false;
        }

        return authenticator.verify({
            token: twoFactorAuthCode,
            secret: user.twoFactorAuthSecret,
        });
    }
}
