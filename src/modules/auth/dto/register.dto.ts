import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCustomerDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: 'John' })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional({ example: '+62812345678' })
    @IsString()
    @IsOptional()
    phone?: string;
}

export class RegisterVendorDto {
    @ApiProperty({ example: 'vendor@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'My Awesome Store' })
    @IsString()
    @IsNotEmpty()
    storeName: string;

    @ApiPropertyOptional({ example: 'We sell awesome products' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: '+62812345678' })
    @IsString()
    @IsOptional()
    phone?: string;
}
