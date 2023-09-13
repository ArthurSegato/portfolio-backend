import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsStrongPassword,
} from 'class-validator';

export class CardCoverDto {

    @IsNotEmpty()
    @IsStrongPassword()
    @Type(() => String)
    key: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    projectId: number
}

export class CardCoverUpdateDto {

    @IsNotEmpty()
    @IsStrongPassword()
    @Type(() => String)
    key: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id: number
}