import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EastereggService {
    constructor(private config: ConfigService) {}

    async sendDiscordWebHook(dto) {
        try {
            const response = await fetch(this.config.get("EASTEREGG_WEBHOOK"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    embeds: [
                        {
                            fields: [
                                {
                                    name: "Message",
                                    value: `${dto.message}`,
                                },
                            ],
                        },
                    ],
                }),
            }).then((response) => {
                if (!response.ok) throw new ServiceUnavailableException("Unable to trigger a discord webhook");
            });

            return { message: "Your message has been received" };
        } catch (error) {
            throw error;
        }
    }
}
