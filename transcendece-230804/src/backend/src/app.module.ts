import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { PrismaService } from './prisma.service';
import { UserServiceModule } from './user/user.module';
import { MatchModule } from './match/match.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
  imports: [
		AuthModule, TwoFactorAuthModule,
		UserServiceModule,
		MatchModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'client'),
    // }),

	],
  // imports: [ConfigModule.forRoot(), AuthModule, UserAuthModule, TwoFactorAuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
