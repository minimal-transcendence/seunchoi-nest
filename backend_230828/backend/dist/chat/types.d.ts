import { Socket } from "socket.io";
type JwtPayload = {
    userId: number;
    email: string;
};
type AuthSocket = {
    nickname: string;
};
export type ChatSocket = Socket & JwtPayload & AuthSocket;
export {};
