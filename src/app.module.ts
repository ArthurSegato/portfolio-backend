import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ProjectsModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), ContactModule, MulterModule.register({
    dest: "./upload"
  }), ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "upload")
  }), ScheduleModule.forRoot(), TasksModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class AppModule { }
