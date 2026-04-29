import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  UserGender,
  UserIsConfirmed,
  UserLevel,
} from 'src/common/enums/user/user.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: UserGender })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ enum: UserIsConfirmed })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(UserIsConfirmed)
  is_confirmed?: UserIsConfirmed;

  @ApiPropertyOptional({ enum: UserLevel })
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(UserLevel)
  level!: UserLevel;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Upload avatar file',
  })
  avatar?: any;
}
