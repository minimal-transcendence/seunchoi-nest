import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users = [];

    async findUserById(userId: number): Promise<any | undefined> {
        return await this.users.find(user => user.id === userId);
    }

    async findUserByEmail(email: string): Promise<any | undefined> {
        return await this.users.find(user => user.email === email);
    }

    async newUser(user: User) {
        const found = await this.findUserById(user.id);
        if(!found) {
            console.log('New User Added');
            this.users.push(user);
        }
    }

    // todo 유저 db에 저장
    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        const user = await this.findUserById(userId);
        user.TwoFactorAuthenricationSecret = secret;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User | null>
    {
        const user = await this.findUserById(userId);

        if (!user) {
            return null;
        }

        if (!user.refreshToken) {
            return null;
        }

        if (user.refreshToken === refreshToken) {
            return user;
        }
    }

    async removeRefreshToken(userId: number): Promise<any> {
        const user = await this.findUserById(userId);

        if(!user) {
            return null;
        }

        user.refreshToken = null;
        return true;
    }
}
