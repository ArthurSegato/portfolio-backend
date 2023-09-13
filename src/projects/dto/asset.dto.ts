import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class AssetDto {

    @IsNotEmpty()
    @IsStrongPassword()
    @Type(() => String)
    key: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    projectId: number

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    alt: string
}

export class AssetUpdateDto {

    @IsNotEmpty()
    @IsStrongPassword()
    @Type(() => String)
    key: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    alt: string
}