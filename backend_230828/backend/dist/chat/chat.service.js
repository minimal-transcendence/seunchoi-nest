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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const store_room_service_1 = require("./store/store.room.service");
const store_user_service_1 = require("./store/store.user.service");
const store_message_service_1 = require("./store/store.message.service");
let ChatService = exports.ChatService = class ChatService {
    constructor(storeUser, storeRoom, storeMessage) {
        this.storeUser = storeUser;
        this.storeRoom = storeRoom;
        this.storeMessage = storeMessage;
    }
    initChatServer() {
        this.storeUser.saveUser(-1, new store_user_service_1.User(-1, 'Server_Admin'));
        this.storeRoom.saveRoom('DEFAULT', new store_room_service_1.Room(-1));
    }
    newConnection(io, client) {
        const userId = client.userId;
        client.join(`$${userId}`);
        let user = this.storeUser.findUserById(userId);
        if (user === undefined)
            user = this.storeUser.saveUser(userId, new store_user_service_1.User(userId, client.nickname));
        user.connected = true;
        client.data.currentRoom = "DEFAULT";
        this.userJoinRoomAct(io, user, "DEFAULT")
            .catch((error) => {
            throw new Error(error.message);
        });
        const roomInfo = this.makeRoomInfo(user.blocklist, user.joinlist);
        const userInfo = this.makeRoomUserInfo("DEFAULT");
        const currRoomInfo = this.makeCurrRoomInfo("DEFAULT");
        client.emit("init", userInfo, roomInfo, currRoomInfo);
    }
    async disconnectUser(io, userId) {
        const sockets = await io.in(`$${userId}`).fetchSockets()
            .then((res) => {
            return (res.size);
        })
            .catch((error) => {
            console.log(error.message);
            throw new Error(error.message);
        });
        if (sockets === 1) {
            const user = this.storeUser.findUserById(userId);
            user.connected = false;
            this.userLeaveRooms(io, userId, user.joinlist);
        }
    }
    async userJoinRoomAct(io, user, roomname) {
        const sockets = await io.in(`$${user.id}`).fetchSockets();
        sockets.forEach((socket) => {
            socket.join(roomname);
        });
        if (!user.joinlist.has(roomname)) {
            user.joinlist.add(roomname);
            const room = this.storeRoom.findRoom(roomname);
            room.addUserToUserlist(user.id);
            const body = `Welcome ${user.nickname} !`;
            const message = new store_message_service_1.Message(-1, body);
            io.in(roomname).emit("sendMessage", roomname, {
                from: "Server_Admin",
                body: body,
                at: message.at
            });
            room.messages.push(message);
            const joiners = await io.in(roomname).fetchSockets();
            const roomMembers = this.makeRoomUserInfo(roomname);
            joiners.forEach((socket) => {
                if (socket.data.currentRoom === roomname)
                    socket.emit("sendRoomMembers", roomMembers);
            });
        }
        const currRoomInfo = this.makeCurrRoomInfo(roomname);
        const roomMembers = this.makeRoomUserInfo(roomname);
        const roomInfo = this.makeRoomInfo(user.blocklist, user.joinlist);
        sockets.forEach((socket) => {
            console.log("res", roomInfo, roomMembers, currRoomInfo);
            socket.emit("sendRoomList", roomInfo);
            socket.emit("sendRoomMembers", roomMembers);
            socket.emit("sendCurrRoomInfo", currRoomInfo);
        });
    }
    JoinRoomBanCheck(io, client, room) {
        if (room.isBanned(client.userId)) {
            client.emit("sendAlert", "Banned User", "You are not allowed to join this room");
            return (false);
        }
        return (true);
    }
    async userJoinRoom(io, client, roomname, password) {
        const userId = client.userId;
        let room = this.storeRoom.findRoom(roomname);
        if (room === undefined) {
            this.storeRoom.saveRoom(roomname, new store_room_service_1.Room(userId, password ? password : null));
            room = this.storeRoom.findRoom(roomname);
            this.userJoinRoomAct(io, this.storeUser.findUserById(userId), roomname);
        }
        else {
            if (room.isJoinning(userId)) {
                this.userJoinRoomAct(io, this.storeUser.findUserById(userId), roomname);
                return;
            }
            if (room.isPrivate) {
                client.emit("sendAlert", "Alert", "This room is Private");
                return;
            }
            const pwExist = room.password ? true : false;
            if (pwExist) {
                if (password) {
                    if (room.isPassword(password)) {
                        if (this.JoinRoomBanCheck(io, client, room))
                            this.userJoinRoomAct(io, this.storeUser.findUserById(userId), roomname);
                    }
                    else
                        client.emit("wrongPassword", roomname);
                }
                else
                    client.emit("requestPassword", roomname);
            }
            else {
                if (this.JoinRoomBanCheck(io, client, room))
                    this.userJoinRoomAct(io, this.storeUser.findUserById(userId), roomname);
            }
        }
    }
    setPassword(io, client, roomname, password) {
        const room = this.storeRoom.findRoom(roomname);
        if (room.isOwner(client.userId)) {
            room.updatePassword(password);
            console.log("password updated");
        }
        else
            client.emit("sendAlert", "Alert", "You have no authority");
    }
    setRoomStatus(io, client, roomname, toPrivate) {
        const room = this.storeRoom.findRoom(roomname);
        if (!room)
            throw new Error("Error : Room does not exist");
        if (room.isOwner(client.userId)) {
            if (toPrivate) {
                if (room.isPrivate)
                    client.emit("sendAlert", "[ Alert ]", 'Room is already Private');
                else {
                    room.isPrivate = true;
                    io.to(roomname).emit("sendCurrRoomInfo", this.makeCurrRoomInfo(roomname));
                }
            }
            else {
                if (room.isPrivate) {
                    room.isPrivate = false;
                    io.to(roomname).emit("sendCurrRoomInfo", this.makeCurrRoomInfo(roomname));
                }
                else
                    client.emit("sendAlert", "[ Alert ]", 'Room is already Public');
            }
        }
        else
            client.emit("sendAlert", "[ Alert ]", "Only owner can set room status");
    }
    sendChat(io, client, to, body) {
        const room = this.storeRoom.findRoom(to);
        if (room === undefined) {
            throw new Error("Error : Room does not exist");
        }
        if (room.userlist.has(client.userId)) {
            if (!room.isMuted(client.userId)) {
                const message = new store_message_service_1.Message(client.userId, body);
                io.in(to).emit("sendMessage", to, {
                    from: client.nickname,
                    body: body,
                    at: message.at
                });
                room.messages.push(message);
            }
            else
                client.emit("sendAlert", "Attention", `You are MUTED in ${to}`);
        }
        else {
            client.emit("sendAlert", "Attention", `You are not joining in room ${to}`);
        }
    }
    userLeaveRoom(io, userId, roomname) {
        const room = this.storeRoom.findRoom(roomname);
        const thisUser = this.storeUser.findUserById(userId);
        if (room === undefined) {
            throw new Error("Error : Room does not exist");
        }
        if (room.userlist.has(userId) && thisUser.joinlist.has(roomname)) {
            if (room.userlist.size == 1) {
                room.clearRoom();
                this.storeRoom.deleteRoom(roomname);
                thisUser.joinlist.delete(roomname);
            }
            else {
                if (room.isOwner(userId)) {
                    const newOwner = room.userlist.values().next().value;
                    room.updateOwner(newOwner);
                    if (room.isOperator(newOwner))
                        room.deleteUserFromOperators(newOwner);
                }
                if (room.isOperator(userId)) {
                    room.deleteUserFromOperators(userId);
                }
                thisUser.joinlist.delete(roomname);
                room.deleteUserFromUserlist(userId);
                const body = `Good bye ${thisUser.nickname}`;
                io.to(roomname).emit("sendMessage", body);
                room.messages.push(new store_message_service_1.Message(-1, body));
                io.to(roomname).except(`$${userId}`).emit("sendRoomMembers", this.makeRoomUserInfo(roomname));
            }
        }
        else
            console.log("you are not joining in this room : try leave");
    }
    async userLeaveRoomAct(io, userid, roomname) {
        const sockets = await io.in(`$${userid}`).fetchSockets();
        sockets.forEach((socket) => {
            socket.leave(roomname);
        });
        this.userJoinRoomAct(io, this.storeUser.findUserById(userid), "DEFAULT");
    }
    userLeaveRooms(io, userid, roomlist) {
        roomlist.forEach((room) => {
            this.userLeaveRoom(io, userid, room);
        });
    }
    async kickUser(io, client, roomname, targetName) {
        const targetId = this.storeUser.getIdByNickname(targetName);
        const room = this.storeRoom.findRoom(roomname);
        if (this.checkActValidity(client, roomname, targetId)) {
            if (room.isOperator(targetId))
                room.deleteUserFromOperators(targetId);
            room.deleteUserFromUserlist(targetId);
            const targetUser = this.storeUser.findUserById(targetId);
            targetUser.joinlist.delete(roomname);
            targetUser.currentRoom = "DEFAULT";
            this.userJoinRoomAct(io, targetUser, "DEFAULT");
            const body = `${targetUser.nickname} is Kicked Out`;
            io.to(roomname).except(`$${targetId}`).emit("sendMessage", roomname, {
                from: "server",
                body: body,
                at: Date.now()
            });
            io.to(roomname).except(`$${targetId}`).emit("sendRoomMembers", this.makeRoomUserInfo(roomname));
            room.storeMessage(-1, body);
            const sockets = await io.in(`$${targetId}`).fetchSockets();
            sockets.forEach((socket) => {
                socket.leave(roomname);
                socket.emit("sendAlert", "Attention", `You are kicked out from ${roomname}`);
                socket.emit("sendRoomMembers", this.makeRoomUserInfo("DEFAULT"));
            });
        }
    }
    banUser(io, client, roomname, targetName) {
        const targetId = this.storeUser.getIdByNickname(targetName);
        const room = this.storeRoom.findRoom(roomname);
        if (this.checkActValidity(client, roomname, targetId)) {
            room.addUserToBanlist(targetId);
            this.kickUser(io, client, roomname, targetName);
        }
    }
    muteUser(io, client, roomname, targetName) {
        const targetId = this.storeUser.getIdByNickname(targetName);
        const room = this.storeRoom.findRoom(roomname);
        if (!this.checkActValidity(client, roomname, targetId))
            return;
        if (room.isMuted(targetId))
            client.emit("sendMessage", roomname, {
                from: "server",
                body: `${this.storeUser.getNicknameById(targetId)} is already muted`,
                at: Date.now()
            });
        else {
            if (room.isOperator(targetId))
                room.deleteUserFromOperators(targetId);
            room.addUserToMutelist(targetId);
            this.emitEventsToAllSockets(io, targetId, "sendMessage", roomname, {
                from: "server",
                body: `You are temporaily muted by ${client.nickname}`,
                at: Date.now()
            });
            io.to(roomname).except(`$${targetId}`).emit("sendMessage", roomname, {
                from: "server",
                body: `${this.storeUser.getNicknameById(targetId)} is temporaily muted`,
                at: Date.now()
            });
            setTimeout(() => {
                room.deleteUserFromMutelist(targetId);
                this.emitEventsToAllSockets(io, targetId, "sendMessage", roomname, {
                    from: "server",
                    body: `You are now unmuted `,
                    at: Date.now()
                });
            }, 20000);
        }
    }
    blockUser(io, client, target) {
        console.log("blockUser : actor : " + client.nickname + " target : " + target);
        const thisUser = this.storeUser.findUserById(client.userId);
        const targetId = this.storeUser.getIdByNickname(target);
        console.log(thisUser);
        if (thisUser.blocklist.has(targetId))
            client.emit("sendAlert", "Notice", "You've already blocked this user");
        else {
            (thisUser.addUserToBlocklist(targetId));
            client.emit("sendAlert", "Notice", `Successfully block ${target}`);
            const blocklist = [];
            thisUser.blocklist.forEach((user) => blocklist.push(this.storeUser.getNicknameById(user)));
            client.emit("sendBlocklist", blocklist);
        }
    }
    unblockUser(io, client, target) {
        const thisUser = this.storeUser.findUserById(client.userId);
        const targetId = this.storeUser.getIdByNickname(target);
        if (thisUser.blocklist.has(targetId)) {
            (thisUser.deleteUserFromBlockList(targetId));
            client.emit("sendAlert", "Notice", `Successfully unblock ${target}`);
            const blocklist = [];
            thisUser.blocklist.forEach((user) => blocklist.push(this.storeUser.getNicknameById(user)));
            client.emit("sendBlocklist", blocklist);
        }
        else {
            client.emit("sendAlert", "Failed", `${target} is not blocked yet`);
        }
    }
    addOperator(io, client, roomname, target) {
        const room = this.storeRoom.findRoom(roomname);
        if (!room.isOwner(client.userId))
            client.emit("sendAlert", "[ Act Error ]", "You have no authority to add operator");
        else {
            const targetId = this.storeUser.getIdByNickname(target);
            if (room.isOperator(targetId))
                client.emit("sendAlert", "[ Act Error ]", "Target is already an operator");
            else {
                room.addUserToOperators(targetId);
                io.to(roomname).emit("sendCurrRoomInfo", this.makeCurrRoomInfo(roomname));
            }
        }
    }
    deleteOperator(io, client, roomname, target) {
        const room = this.storeRoom.findRoom(roomname);
        if (!room.isOwner(client.userId))
            client.emit("sendAlert", "[ Act Error ]", "You have no authority to delete operator");
        else {
            const targetId = this.storeUser.getIdByNickname(target);
            if (room.isOperator(targetId)) {
                room.deleteUserFromOperators(targetId);
                io.to(roomname).emit("sendCurrRoomInfo", this.makeCurrRoomInfo(roomname));
            }
            else {
                client.emit("sendAlert", "[ Act Error ]", "target is not an operator");
            }
        }
    }
    getAllRoomList(userId) {
        const roomlist = [];
        const blocklist = this.storeUser.findUserById(userId).blocklist;
        this.storeRoom.rooms.forEach((value, key) => {
            if (!value.isPrivate)
                roomlist.push(key);
        });
        return (this.makeRoomInfo(blocklist, roomlist));
    }
    getUserRoomList(userId) {
        const thisUser = this.storeUser.findUserById(userId);
        return (this.makeRoomInfo(thisUser.blocklist, thisUser.joinlist));
    }
    getQueryRoomList(query) {
        const res = [];
        if (query === null || query.length === 0)
            return (res);
        const roomlist = this.storeRoom.findQueryMatchRoomNames(query);
        roomlist.forEach((roomname) => {
            const room = this.storeRoom.findRoom(roomname);
            const owner = this.storeUser.getNicknameById(room.owner);
            const userlist = Array.from(room.userlist, (user) => this.storeUser.getNicknameById(user));
            res.push({
                roomname: roomname,
                owner: owner,
                members: userlist
            });
        });
        return (res);
    }
    fetchDM(io, client, target, body) {
        const from = client.userId;
        const to = this.storeUser.getIdByNickname(target);
        const message = new store_message_service_1.DM(from, to, body);
        const res = {
            from: this.storeUser.getNicknameById(from),
            body: body,
            at: message.at
        };
        this.storeMessage.saveMessage(message);
        io.to([`$${from}`, `$${to}`]).emit("sendDM", this.storeUser.getNicknameById(to), res);
    }
    makeDMRoomMessages(from, to) {
        const fromId = this.storeUser.getIdByNickname(from);
        const toId = this.storeUser.getIdByNickname(to);
        const msg = this.storeMessage
            .findMessagesForUser(fromId, toId)
            .map(message => ({
            from: this.storeUser.getNicknameById(message.from),
            to: this.storeUser.getNicknameById(message.to),
            body: message.body,
            at: message.at
        }));
        return (msg);
    }
    makeUserStatus(userId, connection) {
        const user = this.storeUser.findUserById(userId);
        const res = {
            id: userId,
            nickname: user.nickname,
            isGaming: user.isGaming,
            isConnected: user.connected
        };
        return (res);
    }
    makeRoomInfo(blocklist, roomlist) {
        const res = [];
        roomlist.forEach((room) => {
            const message = this.storeRoom.findRoom(room).getLastMessage(blocklist);
            res.push({
                roomname: room,
                lastMessage: message.body
            });
        });
        return res;
    }
    makeRoomUserInfo(roomname) {
        const userInfo = [];
        const room = this.storeRoom.findRoom(roomname);
        room.userlist.forEach((user) => {
            const target = this.storeUser.findUserById(user);
            userInfo.push({
                id: user,
                nickname: target.nickname,
                isGaming: target.isGaming
            });
        });
        return (userInfo);
    }
    mappingMessagesUserIdToNickname(messages) {
        const res = [];
        messages.forEach((msg) => {
            res.push({
                from: `${this.storeUser.getNicknameById(msg.from)}`,
                body: msg.body,
                at: msg.at
            });
        });
        return (res);
    }
    makeCurrRoomInfo(roomname) {
        const room = this.storeRoom.findRoom(roomname);
        const owner = this.storeUser.getNicknameById(room.owner);
        const operatorList = [];
        const joineduserList = [];
        room.userlist.forEach((user) => {
            joineduserList.push(this.storeUser.getNicknameById(user));
        });
        room.operators.forEach((user) => {
            operatorList.push(this.storeUser.getNicknameById(user));
        });
        const res = {
            roomname: roomname,
            owner: owner,
            operators: operatorList,
            joinedUsers: joineduserList,
            messages: this.mappingMessagesUserIdToNickname(room.messages),
            isPrivate: room.isPrivate,
            isProtected: room.password ? true : false
        };
        return (res);
    }
    async sendActResultToTarget(io, roomname, target, operation) {
        let notice;
        if (operation === "kick")
            notice = "Kicked out";
        else if (operation === "ban")
            notice = "Banned";
        else if (operation === "mute")
            notice = "Muted";
        const body = `You are ${notice} from Room "${roomname}"`;
        await this.emitEventsToAllSockets(io, target, "sendMessage", roomname, {
            from: "server",
            body: body,
            at: Date.now()
        });
    }
    checkActValidity(client, roomname, target) {
        const actor = client.userId;
        if (actor === target) {
            client.emit("sendAlert", "[ ACT ERROR ]", "you can't do sth to yourself");
            return (false);
        }
        const room = this.storeRoom.findRoom(roomname);
        if (room === undefined) {
            client.emit("sendAlert", "[ ACT ERROR ]", "Room does not exist");
            return (false);
        }
        const user = this.storeUser.findUserById(actor);
        if (user === undefined || !user.joinlist.has(roomname)) {
            client.emit("sendAlert", "[ ACT ERROR ]", "invalid Actor");
            return (false);
        }
        if (!room.isOwner(user.id) && !room.isOperator(user.id)) {
            client.emit("sendAlert", "[ ACT ERROR ]", "Actor is not authorized");
            return (false);
        }
        if (target === -1) {
            client.emit("sendAlert", "[ ACT ERROR ]", "Target does not exist");
            return (false);
        }
        else if (!room.isJoinning(target)) {
            client.emit("sendAlert", "[ ACT ERROR ]", "Target is not joining this room");
            return (false);
        }
        else if (room.isOwner(target)) {
            client.emit("sendAlert", "[ ACT ERROR ]", "Target is the Owner");
            return (false);
        }
        else if (room.isOperator(target) && !room.isOwner(actor)) {
            client.emit("sendAlert", "[ ACT ERROR ]", "Only owner can do sth to Operator");
            return (false);
        }
        return (true);
    }
    async emitEventsToAllSockets(io, targetId, eventname, args1, args2) {
        const sockets = await io.in(`$${targetId}`).fetchSockets();
        sockets.forEach((socket) => {
            socket.emit(eventname, args1, args2);
        });
    }
    getAllUserInfo(client) {
        const users = this.storeUser.findAllUser();
        const res = [];
        users.forEach((user) => {
            res.push({
                id: user.id,
                nickname: user.nickname,
                isGaming: user.isGaming,
                isConnected: user.connected
            });
        });
        client.emit("responseAllMembers", res);
    }
    userChangeNick(io, client, newNick) {
        const user = this.storeUser.findUserById(client.userId);
        user.nickname = newNick;
    }
};
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [store_user_service_1.ChatUserStoreService,
        store_room_service_1.ChatRoomStoreService,
        store_message_service_1.ChatMessageStoreService])
], ChatService);
//# sourceMappingURL=chat.service.js.map