"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomStoreService = exports.Room = void 0;
const common_1 = require("@nestjs/common");
const store_message_service_1 = require("./store.message.service");
class Room {
    constructor(owner, password) {
        this.password = password ? password : null;
        this.owner = owner;
        this.operators = new Set();
        this.userlist = new Set();
        this.userlist.add(owner);
        this.mutelist = new Set();
        this.banlist = new Set();
        this.messages = [];
        this.isPrivate = false;
    }
    isPassword(input) {
        return (input === this.password);
    }
    isOwner(userid) {
        return (userid === this.owner);
    }
    isOperator(userid) {
        return (this.operators.has(userid));
    }
    isMuted(userid) {
        return (this.mutelist.has(userid));
    }
    isJoinning(userid) {
        return (this.userlist.has(userid));
    }
    isBanned(userid) {
        return (this.banlist.has(userid));
    }
    updatePassword(newPassword) {
        this.password = newPassword;
    }
    updateOwner(newOwner) {
        this.owner = newOwner;
    }
    addUserToUserlist(userid) {
        this.userlist.add(userid);
    }
    addUserToBanlist(userid) {
        this.banlist.add(userid);
        setTimeout(() => {
            this.banlist.delete(userid);
        }, 20000);
    }
    deleteUserFromUserlist(userid) {
        this.userlist.delete(userid);
    }
    addUserToOperators(userid) {
        this.operators.add(userid);
    }
    deleteUserFromOperators(userid) {
        this.operators.delete(userid);
    }
    addUserToMutelist(userid) {
        this.mutelist.add(userid);
    }
    deleteUserFromMutelist(userid) {
        this.mutelist.delete(userid);
    }
    clearSets() {
        this.userlist.clear();
        this.operators.clear();
        this.mutelist.clear();
        this.banlist.clear();
    }
    clearRoom() {
        this.operators = null;
        this.mutelist = null;
        this.banlist = null;
        this.userlist = null;
    }
    storeMessage(from, body) {
        this.messages.push(new store_message_service_1.Message(from, body));
    }
    getLastMessage(blocklist) {
        if (!blocklist || blocklist.size === 0)
            return (this.messages[this.messages.length - 1]);
        const length = this.messages.length;
        for (let i = length - 1; i >= 0; i--) {
            if (!blocklist.has(this.messages[i]?.from))
                return (this.messages[i]);
        }
        return (null);
    }
}
exports.Room = Room;
let ChatRoomStoreService = exports.ChatRoomStoreService = class ChatRoomStoreService {
    constructor() {
        this.rooms = new Map();
    }
    findRoom(roomName) {
        return this.rooms.get(roomName);
    }
    saveRoom(roomname, room) {
        this.rooms.set(roomname, room);
    }
    findAllRoom() {
        return [...this.rooms.values()];
    }
    deleteRoom(roomname) {
        const target = this.rooms.get(roomname);
        if (target !== undefined)
            target.clearRoom();
        this.rooms.delete(roomname);
    }
    findQueryMatchRoomNames(query) {
        const res = [];
        this.rooms.forEach((_, key) => {
            if (key.includes(query)) {
                if (this.findRoom(key).isPrivate == false)
                    res.push(key);
            }
        });
        return (res);
    }
};
exports.ChatRoomStoreService = ChatRoomStoreService = __decorate([
    (0, common_1.Injectable)()
], ChatRoomStoreService);
//# sourceMappingURL=store.room.service.js.map