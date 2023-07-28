import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './42.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { TwoFactorAuthService } from 'src/two-factor-auth/two-factor-auth.service';
import { TwoFactorAuthModule } from 'src/two-factor-auth/two-factor-auth.module';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    forwardRef(()=>TwoFactorAuthModule),
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
              expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
          },
      }),
      inject: [ConfigService],
  }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    TwoFactorAuthService,
    FortyTwoStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    PrismaService,
  ],
})
export class AuthModule {}
