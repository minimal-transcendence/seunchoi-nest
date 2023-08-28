import { Message } from './store.message.service';
export declare class User {
    id: number;
    nickname: string;
    blocklist: Set<number>;
    connected: boolean;
    isGaming: boolean;
    joinlist: Set<string>;
    currentRoom: string;
    messages: Map<number, Message[]>;
    constructor(id: number, nickname: string);
    addUserToBlocklist(userid: number): void;
    deleteUserFromBlockList(userid: number): void;
    addRoomToJoinlist(roomname: string): void;
    deleteRoomFromJoinList(roomname: string): void;
    private clearSets;
    clearUser(): void;
}
interface UserStore {
    users: Map<number, User>;
    findUserById(id: number): User;
    saveUser(id: number, user: User): void;
    findAllUser(): User[];
}
export declare class ChatUserStoreService implements UserStore {
    users: Map<any, any>;
    findUserById(id: number): User | undefined;
    saveUser(id: number, user: User): User;
    findAllUser(): User[];
    getNicknameById(id: number): string | null;
    getIdByNickname(nickname: string): number;
}
export {};
