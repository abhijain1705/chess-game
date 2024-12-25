// validators
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  private readonly id: string;

  @IsString()
  private readonly profile_picture: string;

  @IsString()
  @IsNotEmpty()
  private readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  private readonly email: string;

  @IsString()
  @IsNotEmpty()
  private readonly password: string;

  @IsDateString()
  @IsNotEmpty()
  private readonly created_at: Date;

  @IsDateString()
  @IsNotEmpty()
  private readonly updated_at: Date;

  @IsDateString()
  @IsNotEmpty()
  private readonly last_log_in_date: Date;
}
