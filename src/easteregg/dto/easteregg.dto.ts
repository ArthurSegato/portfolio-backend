import { IsNotEmpty, IsString, Length } from "class-validator";

export class EasterEggtDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 1024)
    message: string;
}
