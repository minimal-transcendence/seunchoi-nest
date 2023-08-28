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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = exports.ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async afterInit() {
        await this.chatService.initChatServer();
    }
    async handleConnection(client) {
        this.logger.log(`Client Connected : ${client.id}, ${client.userId}`);
        client.onAny((any) => {
            this.logger.log(`accept event : ${any}`);
        });
        this.chatService.newConnection(this.io, client);
        client.on("sendChatMessage", (to, body) => {
            this.chatService.sendChat(this.io, client, to, body);
        });
        client.on("selectRoom", (room) => {
            this.chatService.userJoinRoom(this.io, client, room);
        });
        client.on("sendRoomPass", (room, password) => {
            this.chatService.userJoinRoom(this.io, client, room, password);
        });
        client.on("setRoomPass", (room, password) => {
            this.chatService.setPassword(this.io, client, room, password);
        });
        client.on("sendRoomLeave", (room) => {
            this.chatService.userLeaveRoom(this.io, client.userId, room);
            this.chatService.userLeaveRoomAct(this.io, client.userId, room);
        });
        client.on('blockUser', (user) => {
            this.chatService.blockUser(this.io, client, user);
        });
        client.on('unblockUser', (user) => {
            this.chatService.unblockUser(this.io, client, user);
        });
        client.on('kickUser', (roomname, user) => {
            this.chatService.kickUser(this.io, client, roomname, user);
        });
        client.on('banUser', (roomname, user) => {
            this.chatService.banUser(this.io, client, roomname, user);
        });
        client.on('muteUser', (roomname, user) => {
            this.chatService.muteUser(this.io, client, roomname, user);
        });
        client.on('addOperator', (roomname, user) => {
            this.chatService.addOperator(this.io, client, roomname, user);
        });
        client.on('deleteOperator', (roomname, user) => {
            this.chatService.deleteOperator(this.io, client, roomname, user);
        });
        client.on('requestAllRoomList', () => {
            const roomInfo = this.chatService.getAllRoomList(client.userId);
            client.emit('sendRoomList', roomInfo);
        });
        client.on('requestMyRoomList', () => {
            const roomInfo = this.chatService.getUserRoomList(client.userId);
            client.emit('sendRoomList', roomInfo);
        });
        client.on('requestSearchResultRoomList', (query) => {
            const roomInfo = this.chatService.getQueryRoomList(query);
            client.emit('responseRoomQuery', roomInfo);
        });
        client.on('requestRoomMembers', (roomname) => {
            const roomMembers = this.chatService.makeRoomUserInfo(roomname);
            client.emit('sendRoomMembers', roomMembers);
        });
        client.on('selectDMRoom', (username) => {
            const DMs = this.chatService.makeDMRoomMessages(client.nickname, username);
            this.chatService.emitEventsToAllSockets(this.io, client.userId, 'sendDMRoomInfo', username, DMs);
        });
        client.on('sendDirectMessage', (to, body) => {
            this.chatService.fetchDM(this.io, client, to, body);
        });
        client.on('setRoomPrivate', (roomname) => {
            this.chatService.setRoomStatus(this.io, client, roomname, true);
        });
        client.on('setRoomPublic', (roomname) => {
            this.chatService.setRoomStatus(this.io, client, roomname, false);
        });
    }
    async handleDisconnect(client) {
        this.logger.log(client.nickname + 'is leaving');
        await this.chatService.disconnectUser(this.io, client.userId);
    }
    userUpdateNick(userId, newNick) {
        this.io.emit("updateUserNick", userId, newNick);
    }
    userUpdateAvatar(userId) {
        this.io.emit("updateUserAvatar", userId);
    }
    userUpdateStatus(userId, isConnected) {
        this.io.emit("updateUserStatus", userId, isConnected);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], ChatGateway.prototype, "io", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDisconnect", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map