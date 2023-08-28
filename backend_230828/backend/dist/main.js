"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const socket_io_adapter_1 = require("./chat/socket-io-adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    app.use(cookieParser());
    app.useWebSocketAdapter(new socket_io_adapter_1.SocketIOAdapter(app));
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map