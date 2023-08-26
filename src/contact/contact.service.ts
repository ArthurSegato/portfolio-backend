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

      const url = this.config.get('CONTACT_URL');

      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "embeds": [
            {
              "fields": [{
                "name": "Name",
                "value": `${dto.name}`
              },
              {
                "name": "Email",
                "value": `${dto.email}`,
                "inline": true
              },
              {
                "name": "Phone",
                "value": `${dto.phone}`,
                "inline": true
              },
              {
                "name": "Message",
                "value": `${dto.message}`
              }]
            }
          ]
        })
      })

      return { message: 'Your message has been received' };
    }
    catch (error) {
      throw error;
    }
  }
}
