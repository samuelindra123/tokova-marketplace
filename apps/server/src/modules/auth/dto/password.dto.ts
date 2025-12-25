import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ required: false, example: 'VENDOR' })
    @IsOptional()
    @IsString()
    requiredRole?: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'newpassword123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class VerifyEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ example: 'newpassword123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}

export class ResendVerificationDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
