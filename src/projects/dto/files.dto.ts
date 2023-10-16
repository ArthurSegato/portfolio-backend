import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class FilesDto {
    @IsNotEmpty()
    @IsStrongPassword()
    @Type(() => String)
    key: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    projectId: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    facebookAlt: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    twitterAlt: string;
}

export class FilesUpdateDto {
    @IsNotEmpty()
    @IsStrongPassword()
    @Type(() => String)
    key: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number;
}
