import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, UsersModule, TwoFactorAuthModule],
  // imports: [ConfigModule.forRoot(), AuthModule, UsersModule, TwoFactorAuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
