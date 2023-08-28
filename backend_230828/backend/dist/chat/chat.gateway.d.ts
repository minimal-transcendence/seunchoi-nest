import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatSocket } from './types';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private chatService;
    io: Namespace;
    private readonly logger;
    constructor(chatService: ChatService);
    afterInit(): Promise<void>;
    handleConnection(client: ChatSocket): Promise<void>;
    handleDisconnect(client: ChatSocket): Promise<void>;
    userUpdateNick(userId: number, newNick: string): void;
    userUpdateAvatar(userId: number): void;
    userUpdateStatus(userId: number, isConnected: boolean): void;
}
