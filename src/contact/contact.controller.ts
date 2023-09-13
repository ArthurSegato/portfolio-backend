import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  sendDiscordWebHook(@Body() dto: ContactDto) {
    return this.contactService.sendDiscordWebHook(dto);
  }
}
