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
  IsNumber,
} from 'class-validator';

export class CreateProductDto {

  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  price?: string

  @IsString()
  @IsOptional()
  image?: string

  @IsNumber()
  @IsOptional()
  userId?: number

  @IsString()
  @IsEnum(Status)
  status: string

  @IsString()
  @IsEnum(Status)
  featured: string

}
