import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(private config: ConfigService) { }

  async send(dto: ContactDto) {
    try {
      // Omite o numero de telefone do webhook
      if (dto.phone === undefined || dto.phone === null) dto.phone = ''

      const url = this.config.get('WEBHOOK_URL');

      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "content": `${dto.name} ${dto.email} ${dto.phone} ${dto.message}`
        })
      })

      return { message: 'Your message has been received' };
    }
    catch (error) {
      throw error;
    }
  }
}
