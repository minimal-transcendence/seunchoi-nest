"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GameGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const GameRoom_1 = require("./GameRoom");
const game_service_1 = require("./game.service");
const match_service_1 = require("../match/match.service");
let GameGateway = exports.GameGateway = GameGateway_1 = class GameGateway {
    constructor(gameService, matchService) {
        this.gameService = gameService;
        this.matchService = matchService;
        this.logger = new common_1.Logger(GameGateway_1.name);
        this.randomMatchQueue = {
            easy: [],
            normal: [],
            hard: []
        };
        this.gameRooms = {};
    }
    afterInit() {
        this.logger.log('GAME 웹소켓 서버 초기화 ✅');
        setInterval(() => {
            for (let e in this.gameRooms) {
                console.log("GameRoom:", e);
                if (this.gameRooms[e].gameOver) {
                    const room = this.gameRooms[e];
                    if (room.gameStart) {
                        this.matchService.createMatchHistory({
                            winnerId: room.winner.userId,
                            loserId: room.loser.userId
                        });
                        this.io.to(e).emit('gameOver', {
                            roomName: e,
                            winner: room.winner.nickname,
                            loser: room.loser.nickname
                        });
                    }
                    if (room.player[0]) {
                        room.player[0].inGame = false;
                    }
                    if (room.player[1]) {
                        room.player[1].inGame = false;
                    }
                    delete this.gameRooms[e];
                }
            }
        }, 1000);
    }
    handleConnection(client) {
        client.emit('hello');
        client.inGame = false;
        client.invitationList = [];
        const sockets = this.io.sockets;
        this.logger.log(`Game Client Connected : ${client.nickname}`);
        this.logger.debug(`Number of connected Game sockets: ${sockets.size}`);
    }
    handleDisconnect(client) {
        if (client.inGame) {
            this.io.server.emit("notInGame", client.nickname);
            for (let e in this.gameRooms) {
                const room = this.gameRooms[e];
                if (room.player[0] || room.player[1]) {
                    room.gameOver = true;
                    if (room.gameStart) {
                        clearInterval(room.interval);
                        room.winner = client === room.player[0] ? room.player[1] : room.player[0];
                        room.loser = client;
                        console.log("-----Game Over-----");
                        console.log("Winner:", room.winner.nickname);
                        console.log("Loser:", room.loser.nickname);
                        console.log("-------Score-------");
                        console.log(`${room.playerScore[0]} - ${room.player[0].id}`);
                        console.log(`${room.playerScore[1]} - ${room.player[1].id}`);
                    }
                    else {
                        this.io.to(room.name).emit('matchDecline', room.name);
                    }
                }
            }
        }
        const sockets = this.io.sockets;
        this.logger.log(`Game Client Disconnected : ${client.nickname}`);
        this.logger.debug(`Number of connected Game sockets: ${sockets.size}`);
    }
    handleRandomMatchApply(client, mode) {
        console.log(mode);
        if (client.inGame) {
            return;
        }
        if (!mode || (mode !== "easy" && mode !== "normal" && mode !== "hard")) {
            mode = "normal";
            console.log(`mode set to default: ${mode}`);
        }
        let matchQueue = this.randomMatchQueue[mode];
        if (matchQueue.includes(client)) {
            return;
        }
        for (let e in this.randomMatchQueue) {
            if (e !== mode) {
                this.randomMatchQueue[e] = this.randomMatchQueue[e].filter(item => item !== client);
            }
        }
        matchQueue.push(client);
        console.log(this.randomMatchQueue["easy"].length);
        console.log(this.randomMatchQueue["normal"].length);
        console.log(this.randomMatchQueue["hard"].length);
        if (matchQueue.length >= 2) {
            let playerOne = matchQueue[0];
            let playerTwo = matchQueue[1];
            if (playerOne.inGame) {
                matchQueue =
                    matchQueue.filter(item => item !== playerOne);
                return;
            }
            if (playerTwo.inGame) {
                matchQueue =
                    matchQueue.filter(item => item !== playerTwo);
                return;
            }
            const roomName = `room_${playerOne.nickname}_${playerTwo.nickname}`;
            this.gameRooms[roomName] = new GameRoom_1.GameRoom({
                name: roomName,
                player: [playerOne, playerTwo],
                mode: mode
            });
            playerOne.inGame = true;
            playerTwo.inGame = true;
            console.log("create game room:", roomName);
            playerOne.join(roomName);
            playerTwo.join(roomName);
            matchQueue.splice(0, 2);
            this.io.to(roomName).emit('matchStartCheck', {
                roomName: roomName,
                player: [playerOne.nickname, playerTwo.nickname],
                mode: mode
            });
        }
    }
    handleRandomMatchCancel(client) {
        for (const e in this.randomMatchQueue) {
            this.randomMatchQueue[e] = this.randomMatchQueue[e].filter(item => item !== client);
        }
        console.log(this.randomMatchQueue["easy"].length);
        console.log(this.randomMatchQueue["normal"].length);
        console.log(this.randomMatchQueue["hard"].length);
    }
    handleAccept(client, roomName) {
        let room = this.gameRooms[roomName];
        this.gameService.validatePlayerInRoom(client, room);
        if (room.gameStart) {
            return;
        }
        if (client.id === room.player[0].id) {
            room.playerAccept[0] = true;
        }
        else if (client.id === room.player[1].id) {
            room.playerAccept[1] = true;
        }
        if (room.playerAccept[0] && room.playerAccept[1]) {
            this.gameService.startGame(this.io, room);
        }
        ;
    }
    handleDecline(client, roomName) {
        this.gameService.validatePlayerInRoom(client, this.gameRooms[roomName]);
        if (this.gameRooms[roomName].gameStart) {
            return;
        }
        this.gameRooms[roomName].player[0].inGame = false;
        this.gameRooms[roomName].player[1].inGame = false;
        this.io.to(roomName).emit('matchDecline', roomName);
        delete this.gameRooms[roomName];
    }
    handleOneOnOneApply(client, payload) {
        console.log(payload.to);
        const toClient = this.gameService.getSocketByNickname(this.io, payload.to);
        if (!toClient) {
            return `ERR no such user: ${payload.to}`;
        }
        for (let e in client.invitationList) {
            if (this.gameService.objectsAreSame(client.invitationList[e], payload)) {
                return `ERR aleady invite ${payload.to}`;
            }
        }
        client.invitationList.push(payload);
        toClient.invitationList.push(payload);
        client.emit('updateInvitationList', client.invitationList);
        toClient.emit('updateInvitationList', toClient.invitationList);
        console.log(`${client.nickname} - list size: ${client.invitationList.length}`);
        console.log(`${toClient.nickname} - list size: ${toClient.invitationList.length}`);
    }
    handleOneOnOneAccept(client, payload) {
        for (let e in client.invitationList) {
            if (client.invitationList[e].from === payload.from) {
                client.invitationList = client.invitationList.filter((item) => !this.gameService.objectsAreSame(item, payload));
                client.emit('updateInvitationList', client.invitationList);
                const fromClient = this.gameService.getSocketByNickname(this.io, payload.from);
                if (!fromClient) {
                    return `ERR no such user: ${payload.from}`;
                }
                if (fromClient.inGame) {
                    return `ERR ${payload.from} is in game`;
                }
                const roomName = `room_${fromClient.nickname}_${client.nickname}`;
                this.gameRooms[roomName] = new GameRoom_1.GameRoom({
                    name: roomName,
                    player: [fromClient, client],
                    mode: payload.mode
                });
                fromClient.inGame = true;
                client.inGame = true;
                fromClient.join(roomName);
                client.join(roomName);
                console.log("create game room:", roomName);
                fromClient.invitationList = fromClient.invitationList.filter((item) => !this.gameService.objectsAreSame(item, payload));
                fromClient.emit('updateInvitationList', fromClient.invitationList);
                this.io.to(roomName).emit('matchStartCheck', {
                    roomName: roomName,
                    player: [fromClient.nickname, client.nickname],
                    mode: payload.mode
                });
                console.log(`${fromClient.id} - list size: ${fromClient.invitationList.length}`);
                console.log(`${client.id} - list size: ${client.invitationList.length}`);
                return;
            }
        }
        return `ERR no invitation from ${payload.from}`;
    }
    handleOneOnOneDecline(client, payload) {
        client.invitationList = client.invitationList.filter((item) => !this.gameService.objectsAreSame(item, payload));
        client.emit('updateInvitationList', client.invitationList);
        const fromClient = this.gameService.getSocketByNickname(this.io, payload.to);
        if (fromClient) {
            fromClient.invitationList = fromClient.invitationList.filter((item) => !this.gameService.objectsAreSame(item, payload));
            fromClient.emit('updateInvitationList', fromClient.invitationList);
        }
    }
    handleKeydown(client, payload) {
        if (!client.inGame) {
            return;
        }
        this.gameService.validatePlayerInRoom(client, this.gameRooms[payload.roomName]);
        let room = this.gameRooms[payload.roomName];
        switch (payload.key) {
            case 'ArrowLeft':
                if (client === room.player[0]) {
                    room.paddleX[0] -= 7;
                    if (room.paddleX[0] <= 0) {
                        room.paddleX[0] = 0;
                    }
                }
                else {
                    room.paddleX[1] -= 7;
                    if (room.paddleX[1] <= 0) {
                        room.paddleX[1] = 0;
                    }
                }
                break;
            case 'ArrowRight':
                if (client === room.player[0]) {
                    room.paddleX[0] += 7;
                    if (room.paddleX[0] >= room.canvasWidth - room.paddleWidth) {
                        room.paddleX[0] = room.canvasWidth - room.paddleWidth;
                    }
                }
                else {
                    room.paddleX[1] += 7;
                    if (room.paddleX[1] >= room.canvasWidth - room.paddleWidth) {
                        room.paddleX[1] = room.canvasWidth - room.paddleWidth;
                    }
                }
                break;
        }
    }
    handleNicknameChanged(client, nickname) {
        const sockets = this.io.sockets;
        const oldNickname = client.nickname;
        client.invitationList.forEach((invit) => {
            if (invit.from === oldNickname) {
                invit.from = nickname;
            }
            else if (invit.to === oldNickname) {
                invit.to = nickname;
            }
        });
        sockets.forEach((socket) => {
            socket.invitationList.forEach((invit) => {
                if (invit.from === nickname || invit.to === nickname) {
                    socket.emit('updateInvitationList', socket.invitationList);
                    return false;
                }
            });
        });
        console.log(`${client.nickname} is now ${nickname}`);
        client.nickname = nickname;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], GameGateway.prototype, "io", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('randomMatchApply'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleRandomMatchApply", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('randomMatchCancel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleRandomMatchCancel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('matchAccept'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleAccept", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('matchDecline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleDecline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('oneOnOneApply'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleOneOnOneApply", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('oneOnOneAccept'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleOneOnOneAccept", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('oneOnOneDecline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleOneOnOneDecline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keydown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleKeydown", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('changeNick'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleNicknameChanged", null);
exports.GameGateway = GameGateway = GameGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'game',
        pingTimeout: 2000,
        pingInterval: 5000,
    }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        match_service_1.MatchService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map