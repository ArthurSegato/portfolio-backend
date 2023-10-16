import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProjectsController } from "./projects/projects.controller";
import { ProjectsService } from "./projects/projects.service";
import { ProjectsModule } from "./projects/projects.module";
import { PrismaModule } from "./prisma/prisma.module";
import { MulterModule } from "@nestjs/platform-express";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
    imports: [
        ProjectsModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MulterModule.register({
            storage: false,
        }),
        CacheModule.register(),
    ],
    controllers: [ProjectsController],
    providers: [
        ProjectsService,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule {}
