import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { EastereggService } from "./easteregg.service";
import { EasterEggtDto } from "./dto";

@Controller("easteregg")
export class EastereggController {
    constructor(private readonly eastereggService: EastereggService) {}

    @HttpCode(HttpStatus.ACCEPTED)
    @Post()
    sendDiscordWebHook(@Body() dto: EasterEggtDto) {
        return this.eastereggService.sendDiscordWebHook(dto);
    }
}
