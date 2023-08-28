import { Message } from './store.message.service';
export declare class Room {
    password: string | null;
    owner: number;
    operators: Set<number>;
    userlist: Set<number>;
    mutelist: Set<number>;
    banlist: Set<number>;
    messages: Message[];
    isPrivate: boolean;
    constructor(owner: number, password?: string);
    isPassword(input: string): boolean;
    isOwner(userid: number): boolean;
    isOperator(userid: number): boolean;
    isMuted(userid: number): boolean;
    isJoinning(userid: number): boolean;
    isBanned(userid: number): boolean;
    updatePassword(newPassword: string): void;
    updateOwner(newOwner: number): void;
    addUserToUserlist(userid: number): void;
    addUserToBanlist(userid: number): void;
    deleteUserFromUserlist(userid: number): void;
    addUserToOperators(userid: number): void;
    deleteUserFromOperators(userid: number): void;
    addUserToMutelist(userid: number): void;
    deleteUserFromMutelist(userid: number): void;
    private clearSets;
    clearRoom(): void;
    storeMessage(from: number, body: string): void;
    getLastMessage(blocklist: Set<number>): Message;
}
interface RoomStore {
    rooms: Map<string, Room>;
    findRoom(roomName: string): Room;
    saveRoom(roomName: string, room: Room): void;
    findAllRoom(): Room[];
}
export declare class ChatRoomStoreService implements RoomStore {
    rooms: Map<any, any>;
    findRoom(roomName: string): Room;
    saveRoom(roomname: string, room: Room): void;
    findAllRoom(): Room[];
    deleteRoom(roomname: string): void;
    findQueryMatchRoomNames(query: string | null): string[];
}
export {};
