import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiPropertyOptional({ default: 1 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    quantity?: number;
}

export class UpdateCartDto {
    @ApiProperty()
    @IsNumber()
    @Min(0)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    addressId: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    paymentMethod?: string;
}

export class AddToWishlistDto {
    @ApiProperty()
    @IsUUID()
    productId: string;
}

export class CreateAddressDto {
    @ApiProperty({ example: 'Home' })
    @IsString()
    label: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    recipientName: string;

    @ApiProperty({ example: '+62812345678' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'Jl. Sudirman No. 123' })
    @IsString()
    addressLine: string;

    @ApiProperty({ example: 'Jakarta' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'DKI Jakarta' })
    @IsString()
    province: string;

    @ApiProperty({ example: '12345' })
    @IsString()
    postalCode: string;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

export class UpdateAddressDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    label?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    recipientName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    addressLine?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    province?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    postalCode?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}
