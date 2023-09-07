import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ProjectsModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), ContactModule, MulterModule.register({
    dest: "./upload"
  }), ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "upload")
  }), /*CacheModule.register()*/],
  controllers: [ProjectsController],
  providers: [ProjectsService, /*{
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor
  }*/],
})
export class AppModule { }
