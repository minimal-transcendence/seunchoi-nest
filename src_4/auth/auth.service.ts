import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { FortyTwoStrategy } from './42.strategy';
import { JwtService } from '@nestjs/jwt';
// import { User } from 'src/users/entities/user.entity';
// import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UsersService } from 'src/users/users.service';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async generateTwoFactorAuthenticationSecret(email: string): Promise<any> {

        // generate secret key
        const secret = authenticator.generateSecret();

        const otpAuthUrl = authenticator.keyuri(email, 'seunchoi-2fa', secret);

        // 유저 db에 secret 저장
        // await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {
            secret,
            otpAuthUrl
        }
    }

    async pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<void> {
        return toFileStream(stream, otpAuthUrl);
    }

    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        if(!user.twoFactorAuthenricationSecret) {
            return false;
        }

        return authenticator.verify({
          token: twoFactorAuthenticationCode,
          secret: user.twoFactorAuthenricationSecret,
        })
    }

    async generateAccessToken(user: User): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        }
        return await this.jwtService.signAsync(payload);
    }

    async generateRefreshToken(user: User): Promise<string> {
        const payload = {
            id: user.id
        }
        return await this.jwtService.signAsync({id: payload.id}, {
        // secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        // expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
            secret: '2582',
            expiresIn: '30d'
        });
    }

    // async refresh(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
    async refresh(refreshTokenDto: any): Promise<{ accessToken: string }> {
        const { refresh_token } = refreshTokenDto;
    
        // Verify refresh token
        // JWT Refresh Token 검증 로직
        // const decodedRefreshToken = this.jwtService.verify(refresh_token, { secret: process.env.JWT_REFRESH_SECRET });
        const decodedRefreshToken = await this.jwtService.verifyAsync(refresh_token, { secret: '2582' });
    
        // Check if user exists
        const userId = decodedRefreshToken.id;
        
        // Get user information by refresh_token and userId
        // const payload = await this.userService.getUserIfRefreshTokenMatches(refresh_token, userId);

        // FOR TEST
        const user = await this.usersService.getUserIfRefreshTokenMatches(refresh_token, userId);

        if (!user) {
          throw new UnauthorizedException('Invalid user!');
        }
    
        // Generate new access token
        const accessToken = await this.generateAccessToken(user);
    
        return {accessToken};
      }
}