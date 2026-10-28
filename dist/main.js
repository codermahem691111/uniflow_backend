"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const app_config_service_1 = require("./config/app-config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(app_config_service_1.AppConfigService);
    app.setGlobalPrefix('api');
    app.use((0, helmet_1.default)());
    app.enableCors({ origin: config.frontendUrl });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(config.port);
    common_1.Logger.log(`API is running on http://localhost:${config.port}/api`, 'Bootstrap');
}
void bootstrap();
//# sourceMappingURL=main.js.map