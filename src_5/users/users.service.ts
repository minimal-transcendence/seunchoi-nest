import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users = [];

    async findUserById(userId: number): Promise<any | undefined> {
        return await this.users.find(user => user.id === userId);
    }

    async newUser(user: User) {
        console.log('New User Added');
        this.users.push(user);
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

    async setRefreshToken(user: User, refreshToken: string): Promise<void> {
        let target = await this.findUserById(user.id);

        target.refreshToken = refreshToken;
    }

    async removeRefreshToken(userId: number): Promise<any> {
        const user = await this.findUserById(userId);

        if(!user) {
            return null;
        }

        user.refreshToken = null;
        return true;
    }

    async setTwoFactorAuthSecret(user: User, secret: string): Promise<void> {
        let target = await this.findUserById(user.id);

        target.twoFactorAuthSecret = secret;
    }

    async setTwoFactorAuth(user: User, bool: boolean): Promise<void> {
        let target = await this.findUserById(user.id);

        target.is2faEnabled = true;
    }
}
