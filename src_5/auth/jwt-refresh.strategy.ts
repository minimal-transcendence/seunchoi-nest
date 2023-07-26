import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    // private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token;
        },
      ]),
    //   secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      secretOrKey: '2582',
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const refreshToken = req.cookies?.refresh_token;
    return await this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload.id,
    );
  }
}