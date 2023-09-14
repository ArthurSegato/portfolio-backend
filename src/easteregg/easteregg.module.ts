import { Module } from '@nestjs/common';
import { EastereggController } from './easteregg.controller';
import { EastereggService } from './easteregg.service';

@Module({
  controllers: [EastereggController],
  providers: [EastereggService]
})
export class EastereggModule {}
