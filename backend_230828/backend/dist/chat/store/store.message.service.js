"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageStoreService = exports.DM = exports.Message = void 0;
const common_1 = require("@nestjs/common");
class Message {
    constructor(from, body) {
        this.from = from;
        this.body = body;
        this.at = Date.now();
    }
}
exports.Message = Message;
class DM {
    constructor(from, to, body) {
        this.from = from,
            this.to = to,
            this.body = body,
            this.at = Date.now();
    }
}
exports.DM = DM;
let ChatMessageStoreService = exports.ChatMessageStoreService = class ChatMessageStoreService {
    constructor() {
        this.messages = [];
    }
    saveMessage(message) {
        this.messages.push(message);
    }
    findMessagesForUser(fromId, toId) {
        const res = this.messages.filter(({ from, to }) => ((from === fromId && to === toId) ||
            (from === toId && to === fromId)));
        return (res);
    }
};
exports.ChatMessageStoreService = ChatMessageStoreService = __decorate([
    (0, common_1.Injectable)()
], ChatMessageStoreService);
//# sourceMappingURL=store.message.service.js.map