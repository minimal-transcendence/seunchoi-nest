import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './42.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret, // ConfigService JWT_ACCESS_SECRET
      signOptions: { expiresIn: '20s' }, // ConfigService JWT_ACCESS_EXPIRATION_TIME
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    FortyTwoStrategy,
    JwtStrategy,
    JwtRefreshStrategy
  ]
})
export class AuthModule {}
