"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = exports.GameService = class GameService {
    validatePlayerInRoom(player, gameRoom) {
        if (!gameRoom) {
            throw new Error('no such room');
        }
        if (player !== gameRoom.player[0] && player !== gameRoom.player[1]) {
            throw new Error(`no such user in the room: ${player.id}`);
        }
    }
    startGame(io, room) {
        room.gameStart = true;
        io.to(room.name).emit('startGame', {
            roomName: room.name,
            player: [room.player[0].nickname, room.player[1].nickname],
            mode: room.mode,
            canvasWidth: room.canvasWidth,
            canvasHeight: room.canvasHeight,
            paddleWidth: room.paddleWidth,
            paddleHeight: room.paddleHeight,
            paddleX: room.paddleX,
            ballX: room.ballX,
            ballY: room.ballY,
            ballRadius: room.ballRadius,
        });
        room.interval = setInterval(() => {
            this.ballMove(room);
            io.to(room.name).emit('gameData', {
                roomName: room.name,
                ballX: room.ballX,
                ballY: room.ballY,
                paddleX: room.paddleX,
                playerScore: room.playerScore,
            });
        }, 15);
    }
    ballMove(room) {
        room.ballY += room.speedY * room.ballDirection;
        room.ballX += room.speedX;
        if (room.ballX < 0 && room.speedX < 0) {
            room.speedX = -room.speedX;
        }
        if (room.ballX > room.canvasWidth && room.speedX > 0) {
            room.speedX = -room.speedX;
        }
        if (room.ballY > room.canvasHeight - room.paddleDiff) {
            if (room.ballX >= room.paddleX[0] && room.ballX <= room.paddleX[0] + room.paddleWidth) {
                room.speedY += 1;
                if (room.speedY > room.maxSpeedY) {
                    room.speedY = room.maxSpeedY;
                }
                room.ballDirection = -room.ballDirection;
                room.speedX = room.speedX > 0 ?
                    Math.random() * room.maxSpeedX :
                    Math.random() * -room.maxSpeedX;
            }
            else {
                room.playerScore[1]++;
                console.log(room.playerScore);
                if (room.playerScore[1] >= 3) {
                    clearInterval(room.interval);
                    room.winner = room.player[1];
                    room.loser = room.player[0];
                    room.gameOver = true;
                    console.log("-----Game Over-----");
                    console.log("Winner:", room.winner.nickname);
                    console.log("Loser:", room.loser.nickname);
                    console.log("-------Score-------");
                    console.log(`${room.playerScore[0]} - ${room.player[0].nickname}`);
                    console.log(`${room.playerScore[1]} - ${room.player[1].nickname}`);
                    return;
                }
                room.ballX = room.canvasWidth / 2;
                room.ballY = room.canvasHeight / 2;
                room.speedY = room.defaultSpeedY;
                room.speedX = 0;
            }
        }
        if (room.ballY < room.paddleDiff) {
            if (room.ballX >= room.paddleX[1] && room.ballX <= room.paddleX[1] + room.paddleWidth) {
                room.speedY += 1;
                if (room.speedY > room.maxSpeedY) {
                    room.speedY = room.maxSpeedY;
                }
                room.ballDirection = -room.ballDirection;
                room.speedX = room.speedX > 0 ?
                    Math.random() * room.maxSpeedX :
                    Math.random() * -room.maxSpeedX;
            }
            else {
                room.playerScore[0]++;
                console.log(room.playerScore);
                if (room.playerScore[0] >= 3) {
                    clearInterval(room.interval);
                    room.winner = room.player[0];
                    room.loser = room.player[1];
                    room.gameOver = true;
                    console.log("-----Game Over-----");
                    console.log("Winner:", room.winner.nickname);
                    console.log("Loser:", room.loser.nickname);
                    console.log("-------Score-------");
                    console.log(`${room.playerScore[0]} - ${room.player[0].nickname}`);
                    console.log(`${room.playerScore[1]} - ${room.player[1].nickname}`);
                    return;
                }
                room.ballX = room.canvasWidth / 2;
                room.ballY = room.canvasHeight / 2;
                room.speedY = room.defaultSpeedY;
                room.speedX = 0;
            }
        }
    }
    getSocketByNickname(io, nickname) {
        let found;
        io.sockets.forEach((socket) => {
            if (socket.nickname === nickname) {
                found = socket;
            }
        });
        return found;
    }
    objectsAreSame(x, y) {
        var objectsAreSame = true;
        for (var propertyName in x) {
            if (x[propertyName] !== y[propertyName]) {
                objectsAreSame = false;
                break;
            }
        }
        return objectsAreSame;
    }
};
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map