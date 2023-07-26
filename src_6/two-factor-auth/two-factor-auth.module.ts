import { Module, forwardRef } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(()=>AuthModule),
    UsersModule
  ],
  providers: [
    ConfigService,
    TwoFactorAuthService,
    AuthService,
    PrismaService,
    JwtService
  ],
  controllers: [TwoFactorAuthController],
  exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
