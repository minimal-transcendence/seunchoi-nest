import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './42.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { TwoFactorAuthService } from 'src/two-factor-auth/two-factor-auth.service';
import { TwoFactorAuthModule } from 'src/two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(()=>TwoFactorAuthModule),
    HttpModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // ConfigService JWT_ACCESS_SECRET
      signOptions: { expiresIn: '900s' }, // ConfigService JWT_ACCESS_EXPIRATION_TIME
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwoFactorAuthService,
    FortyTwoStrategy,
    JwtStrategy,
    JwtRefreshStrategy
  ],
  // exports: [
  //   AuthService,
  //   FortyTwoStrategy,
  //   JwtStrategy,
  //   JwtRefreshStrategy
  // ]
})
export class AuthModule {}
