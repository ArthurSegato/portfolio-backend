import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(private config: ConfigService) { }

  async sendDiscordWebHook(contactInfo) {
    try {
      if (contactInfo.phone === undefined || contactInfo.phone === null) contactInfo.phone = 'N/A'

      const response = await fetch(this.config.get('CONTACT_ENDPOINT'), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "embeds": [
            {
              "fields": [{
                "name": "Name",
                "value": `${contactInfo.name}`
              },
              {
                "name": "Email",
                "value": `${contactInfo.email}`,
                "inline": true
              },
              {
                "name": "Phone",
                "value": `${contactInfo.phone}`,
                "inline": true
              },
              {
                "name": "Message",
                "value": `${contactInfo.message}`
              }]
            }
          ]
        })
      })
        .then((response) => {
          if (!response.ok) throw new ServiceUnavailableException('Unable to trigger a discord webhook');
        })

      return { message: 'Your message has been received' };
    }
    catch (error) {
      throw error;
    }
  }
}
