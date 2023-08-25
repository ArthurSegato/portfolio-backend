import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  send(@Body() dto: ContactDto) {
    return this.contactService.send(dto);
  }
}
