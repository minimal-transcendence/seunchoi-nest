import { Module, forwardRef } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(()=>AuthModule),
    UsersModule
  ],
  providers: [
    TwoFactorAuthService,
    AuthService,
  ],
  controllers: [TwoFactorAuthController],
  exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
