"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
class GameRoom {
    constructor({ name, player, mode }) {
        this.gameStart = false;
        this.gameOver = false;
        this.name = name;
        this.player = [player[0], player[1]];
        this.mode = mode;
        this.playerAccept = [false, false];
        this.playerScore = [0, 0];
        this.canvasWidth = 900;
        this.canvasHeight = 1600;
        switch (mode) {
            case 'easy':
                this.paddleWidth = 200;
                this.defaultSpeedY = 4;
                this.maxSpeedY = 10;
                break;
            case 'hard':
                this.paddleWidth = 100;
                this.defaultSpeedY = 8;
                this.maxSpeedY = 15;
                break;
            default:
                this.paddleWidth = 150;
                this.defaultSpeedY = 6;
                this.maxSpeedY = 12;
                break;
        }
        this.paddleHeight = 10;
        this.paddleDiff = 25;
        this.paddleX = [this.canvasWidth / 2 - this.paddleWidth / 2,
            this.canvasWidth / 2 - this.paddleWidth / 2];
        this.ballX = this.canvasWidth / 2;
        this.ballY = this.canvasHeight / 2;
        this.ballRadius = 5;
        this.ballDirection = 1;
        this.speedY = this.defaultSpeedY;
        this.speedX = 0;
        this.maxSpeedX = this.canvasWidth / 150;
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=GameRoom.js.map