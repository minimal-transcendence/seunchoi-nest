"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUserStoreService = exports.User = void 0;
const common_1 = require("@nestjs/common");
class User {
    constructor(id, nickname) {
        this.id = id;
        this.nickname = nickname;
        this.blocklist = new Set();
        this.connected = true;
        this.isGaming = false;
        this.joinlist = new Set();
    }
    addUserToBlocklist(userid) {
        this.blocklist.add(userid);
    }
    deleteUserFromBlockList(userid) {
        this.blocklist.delete(userid);
    }
    addRoomToJoinlist(roomname) {
        this.joinlist.add(roomname);
    }
    deleteRoomFromJoinList(roomname) {
        this.joinlist.delete(roomname);
    }
    clearSets() {
        this.blocklist.clear();
        this.joinlist.clear();
    }
    clearUser() {
        this.clearSets();
        this.blocklist = null;
        this.joinlist = null;
    }
}
exports.User = User;
let ChatUserStoreService = exports.ChatUserStoreService = class ChatUserStoreService {
    constructor() {
        this.users = new Map();
    }
    findUserById(id) {
        return this.users.get(id);
    }
    saveUser(id, user) {
        const target = this.users.get(id);
        if (target === undefined) {
            this.users.set(id, user);
            return (this.users.get(id));
        }
        else
            return (target);
    }
    findAllUser() {
        return [...this.users.values()];
    }
    getNicknameById(id) {
        const user = this.findUserById(id);
        if (user === undefined)
            return (null);
        else
            return (user.nickname);
    }
    getIdByNickname(nickname) {
        const res = this.findAllUser().find((user) => user.nickname === nickname);
        return (res ? res.id : -1);
    }
};
exports.ChatUserStoreService = ChatUserStoreService = __decorate([
    (0, common_1.Injectable)()
], ChatUserStoreService);
//# sourceMappingURL=store.user.service.js.map