import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ProjectsModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), ContactModule, MulterModule.register({
    dest: "./upload"
  })],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class AppModule { }
