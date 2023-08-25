import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  async send(dto: ContactDto) {
    try {
      // Manda mensagem pro bot do discord
      return { message: 'Your message has been received' };
    }
    catch (error) {
      throw error;
    }
  }
}
