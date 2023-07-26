export class User {
    id: number;
    username: string;
    email: string;
    is2faEnabled: boolean;
    twoFactorAuthSecret: string;

    // hashed
    refreshToken: string;
}