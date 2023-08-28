"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOAdapter = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SocketIOAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.app = app;
        this.logger = new common_1.Logger(SocketIOAdapter.name);
    }
    createIOServer(port, options) {
        this.logger.log('웹소켓 서버 생성 - socket.io');
        const jwtService = this.app.get(jwt_1.JwtService);
        const server = super.createIOServer(port, options);
        server.of('chat').use(createJwtMiddleware(jwtService, this.logger));
        server.of('game').use(createGameMiddleware(server.of('game'), jwtService, this.logger));
        return server;
    }
}
exports.SocketIOAdapter = SocketIOAdapter;
const createJwtMiddleware = (jwtService, logger) => (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return;
    }
    const nickname = socket.handshake.query.nickname;
    try {
        if (!token) {
            throw new Error();
        }
        logger.debug(`Validating jwt token before connection: ${token}`);
        const payload = jwtService.verify(token, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET
        });
        socket.userId = payload.id;
        socket.email = payload.email;
        socket.nickname = nickname;
        next();
    }
    catch {
        next(new Error('FORBIDDEN'));
    }
};
const createGameMiddleware = (io, jwtService, logger) => (socket, next) => {
    const token = socket.handshake.auth.token;
    const nickname = socket.handshake.query.nickname;
    try {
        if (!token) {
            throw new Error();
        }
        logger.debug(`Validating jwt token before connection: ${token}`);
        const payload = jwtService.verify(token, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET
        });
        socket.userId = payload.id;
        socket.email = payload.email;
        socket.nickname = nickname;
        io.sockets.forEach((e) => {
            console.log(e.userId);
            console.log(socket.userId);
            if (e.userId === socket.userId) {
                console.log("you already have connection");
                throw new Error();
            }
        });
        next();
    }
    catch {
        next(new Error('FORBIDDEN'));
    }
};
const add = function (x) {
    return function (y) {
        return x + y;
    };
};
//# sourceMappingURL=socket-io-adapter.js.map