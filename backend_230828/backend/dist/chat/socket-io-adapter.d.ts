import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
export declare class SocketIOAdapter extends IoAdapter {
    private app;
    private readonly logger;
    constructor(app: INestApplicationContext);
    createIOServer(port: number, options?: ServerOptions): Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
}
