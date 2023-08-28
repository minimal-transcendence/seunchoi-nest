import { GameRoomParams, GameSocket } from "./types";
export declare class GameRoom {
    interval: any;
    gameStart: boolean;
    gameOver: boolean;
    name: string;
    mode: string;
    player: GameSocket[];
    playerAccept: boolean[];
    canvasWidth: number;
    canvasHeight: number;
    paddleHeight: number;
    paddleWidth: number;
    paddleDiff: number;
    paddleX: number[];
    ballX: number;
    ballY: number;
    ballRadius: number;
    ballDirection: number;
    speedY: number;
    speedX: number;
    maxSpeedY: number;
    maxSpeedX: number;
    defaultSpeedY: number;
    winner: GameSocket;
    loser: GameSocket;
    playerScore: number[];
    constructor({ name, player, mode }: GameRoomParams);
}
