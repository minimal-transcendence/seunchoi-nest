import { GameSocket } from './types';
import { GameRoom } from './GameRoom';
import { Namespace } from 'socket.io';
export declare class GameService {
    validatePlayerInRoom(player: GameSocket, gameRoom: GameRoom): void;
    startGame(io: Namespace, room: GameRoom): void;
    ballMove(room: GameRoom): void;
    getSocketByNickname(io: Namespace, nickname: string): GameSocket;
    objectsAreSame(x: Object, y: Object): boolean;
}
