import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';

@Module({
  imports: [AuthModule, UsersModule, TwoFactorAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
