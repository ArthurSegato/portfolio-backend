import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as compression from "compression";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        helmet({
            crossOriginResourcePolicy: {
                policy: "same-site",
            },
        }),
    );
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.use(compression());
    await app.listen(process.env.PORT || 3001);
}
bootstrap();
