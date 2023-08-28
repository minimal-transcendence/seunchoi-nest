import { Injectable } from '@nestjs/common';
import { Message } from './store.message.service';

export class Room {
	password : string | null;
	owner : number;
	operators : Set<number>;
	userlist : Set<number>;
	mutelist : Set<number>;
	banlist : Set<number>;
	messages : Message[];
	isPrivate : boolean;

	constructor(
		owner : number,
		password? : string,
	){
		this.password = password? password : null;
		this.owner = owner;
		this.operators = new Set();
		this.userlist = new Set();
		this.userlist.add(owner);	//CHECK : if default room needs owner
		this.mutelist = new Set();
		this.banlist = new Set();
		this.messages = [];
		this.isPrivate = false;
	}

	isPassword(input : string) : boolean {
		return (input === this.password);
	}

	isOwner(userid : number) : boolean {
		return (userid === this.owner);
	}
	
	isOperator(userid : number) : boolean {
		return (this.operators.has(userid));
	}

	isMuted(userid : number) : boolean {
		return (this.mutelist.has(userid));
	}

	isJoinning(userid : number) : boolean {
		return (this.userlist.has(userid));
	}
	
	isBanned(userid : number) : boolean {
		return (this.banlist.has(userid));
	}

	updatePassword(newPassword : string){
		this.password = newPassword;
	}

	updateOwner(newOwner : number){
		this.owner = newOwner;
	}

	addUserToUserlist(userid : number){
		this.userlist.add(userid);
	}

	addUserToBanlist(userid : number){
		this.banlist.add(userid);
		setTimeout(() => {
			this.banlist.delete(userid);
		}, 20000);
	}

	deleteUserFromUserlist(userid : number){
		this.userlist.delete(userid);
	}

	addUserToOperators(userid : number){
		this.operators.add(userid);
	}

	deleteUserFromOperators(userid : number){
		this.operators.delete(userid);
	}

	addUserToMutelist(userid : number){
		this.mutelist.add(userid);
	}

	deleteUserFromMutelist(userid : number){
		this.mutelist.delete(userid);
	}
	private clearSets(){
		this.userlist.clear();
		this.operators.clear();
		this.mutelist.clear();
		this.banlist.clear();
	}

	clearRoom(){
		// this.clearSets();	//CHECK : if necessary
		this.operators = null;
		this.mutelist = null;
		this.banlist = null;
		this.userlist = null;
	}

	storeMessage(from : number, body : string){
		this.messages.push(new Message(from, body));
	}

	getLastMessage(blocklist : Set<number>) : Message {
		if (!blocklist || blocklist.size === 0)
			return (this.messages[this.messages.length - 1]);
		const length = this.messages.length;
		for (let i = length - 1 ; i >= 0 ; i--) {
			if (!blocklist.has(this.messages[i]?.from))
				return (this.messages[i]);
		}
		return (null);	//might cause error
	}
}

interface RoomStore {
  rooms: Map<string, Room>;

  findRoom(roomName: string): Room;
  saveRoom(roomName: string, room: Room): void;
  findAllRoom(): Room[];
}

@Injectable()
export class ChatRoomStoreService implements RoomStore{
	rooms = new Map();

	findRoom(roomName: string): Room {
		return this.rooms.get(roomName);
	}

	saveRoom(roomname: string, room: Room): void {
		this.rooms.set(roomname, room);
	}

	findAllRoom(): Room[] {
		return [...this.rooms.values()];
	}

	deleteRoom(roomname: string) : void {
		const target = this.rooms.get(roomname);
		if (target !== undefined)
			target.clearRoom();
		this.rooms.delete(roomname);
	}

	findQueryMatchRoomNames(query : string | null) : string[] {
		const res = [];
		this.rooms.forEach((_, key) => {
			if (key.includes(query)){
				if (this.findRoom(key).isPrivate == false)
					res.push(key);
			}
		})
		return (res);
	}
}
