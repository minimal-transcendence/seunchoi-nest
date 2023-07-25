import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { FortyTwoStrategy } from './42.strategy';
import { JwtService } from '@nestjs/jwt';
// import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async generateAccessToken(user: any): Promise<string> {
        const payload = {
            id: user.id,
            username: user.username,
        }
        return await this.jwtService.signAsync(payload);
    }

    async generateRefreshToken(user: any): Promise<string> {
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