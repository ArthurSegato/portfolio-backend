import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsUrl,
    ValidateNested,
} from 'class-validator';

enum Category {
    GAMEDEV,
    WEBDEV,
    MOBILE,
    BOT,
    LOCALIZATION,
    UI,
    UX,
    DESIGN
}

enum Unit {
    B,
    KB,
    MB,
    GB
}

export class LinkDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;
}

export class ProjectsDto {
    @IsNotEmpty()
    @IsStrongPassword()
    key: string

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    longDescription: string;

    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;

    @IsOptional()
    @IsInt()
    visits: number;

    @IsOptional()
    @IsInt()
    downloads: number;

    @IsOptional()
    @IsNumber()
    revenue: number;

    @IsNotEmpty()
    @IsArray()
    techStack: string;

    @IsOptional()
    @IsNumber()
    size: number;

    @IsOptional()
    @IsEnum(Unit)
    sizeUnit: Unit;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LinkDto)
    links: LinkDto[];

    @IsOptional()
    @IsArray()
    embeds: string;
}

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
    @Type(() => String)
    alt: string
}

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