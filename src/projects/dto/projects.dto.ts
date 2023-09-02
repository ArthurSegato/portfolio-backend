import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
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

    @IsNotEmpty()
    @IsInt()
    visits: number;

    @IsNotEmpty()
    @IsInt()
    downloads: number;

    @IsNotEmpty()
    @IsNumber()
    revenue: number;

    @IsNotEmpty()
    @IsInt()
    stars: number;

    @IsNotEmpty()
    @IsArray()
    techStack: string;

    @IsNotEmpty()
    @IsString()
    license: string;

    @IsNotEmpty()
    @IsNumber()
    size: number;

    @IsNotEmpty()
    @IsEnum(Unit)
    sizeUnit: Unit;

    @IsNotEmpty()
    @IsDateString()
    createdAt: string;

    @IsNotEmpty()
    @IsDateString()
    updatedAt: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LinkDto)
    links: LinkDto[];
}

export class FileUploadDto {

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
    role: string

    @IsOptional()
    @Type(() => String)
    alt: string
}