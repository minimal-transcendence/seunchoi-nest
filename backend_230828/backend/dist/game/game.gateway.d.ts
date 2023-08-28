import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { Invitation, GameSocket, KeydownPayload } from './types';
import { GameService } from './game.service';
import { MatchService } from 'src/match/match.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private gameService;
    private matchService;
    private readonly logger;
    private randomMatchQueue;
    private gameRooms;
    constructor(gameService: GameService, matchService: MatchService);
    io: Namespace;
    afterInit(): void;
    handleConnection(client: GameSocket): void;
    handleDisconnect(client: GameSocket): void;
    handleRandomMatchApply(client: GameSocket, mode: string): void;
    handleRandomMatchCancel(client: GameSocket): void;
    handleAccept(client: GameSocket, roomName: string): void;
    handleDecline(client: GameSocket, roomName: string): void;
    handleOneOnOneApply(client: GameSocket, payload: Invitation): string;
    handleOneOnOneAccept(client: GameSocket, payload: Invitation): string;
    handleOneOnOneDecline(client: GameSocket, payload: Invitation): void;
    handleKeydown(client: GameSocket, payload: KeydownPayload): void;
    handleNicknameChanged(client: GameSocket, nickname: string): void;
}
