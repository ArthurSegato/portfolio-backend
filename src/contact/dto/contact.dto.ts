import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from 'class-validator';

export class ContactDto {

    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @Length(2, 1024)
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    @Length(2, 1024)
    phone: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 1024)
    message: string;
}
