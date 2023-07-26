import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService
    ) {}

    async generateQrCode(stream: Response, user: User): Promise<any> {
        if (user.otpSecret) {
            return stream.send({
                message: 'you already have otp secret',
            })
        }
        const secret = authenticator.generateSecret();

        this.usersService.setTwoFactorAuthSecret(user.id, secret);

        const otpAuthUrl = authenticator.keyuri(user.email, 'seunchoi-2fa', secret);
        return toFileStream(stream, otpAuthUrl);
    }

    async isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
        if(!user.otpSecret) {
            return false;
        }

        return authenticator.verify({
            token: twoFactorAuthCode,
            secret: user.otpSecret,
        });
    }
}
