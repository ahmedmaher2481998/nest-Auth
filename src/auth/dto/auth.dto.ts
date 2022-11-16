import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
