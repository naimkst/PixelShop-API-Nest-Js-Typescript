import { Status, UserType } from '@prisma/client';
import {
  IsString,
  IsEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsDefined,
} from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsOptional()
  fname?: string;

  @IsString()
  @IsOptional()
  lname?: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Matches(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @IsNotEmpty()
  @MinLength(6)
  password: string;


}
