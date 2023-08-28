export declare class Message {
    readonly from: number;
    readonly body: string;
    readonly at: number;
    constructor(from: number, body: string);
}
export declare class DM {
    readonly from: number;
    readonly to: number;
    readonly body: string;
    readonly at: number;
    constructor(from: number, to: number, body: string);
}
interface DMStore {
    messages: DM[];
    saveMessage(message: DM): void;
    findMessagesForUser(from: number, to: number): DM[];
}
export declare class ChatMessageStoreService implements DMStore {
    messages: any[];
    saveMessage(message: DM): void;
    findMessagesForUser(fromId: number, toId: number): DM[];
}
export {};
