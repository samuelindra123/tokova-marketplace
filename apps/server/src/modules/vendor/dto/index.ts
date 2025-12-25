import { IsString, IsOptional, IsNumber, IsArray, IsEnum, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoreDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    storeName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    bankInfo?: any;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    logo?: string;
}

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15 Pro' })
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 15000000 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 14000000 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    salePrice?: number;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({ example: 0.5 })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiPropertyOptional()
    @IsOptional()
    attributes?: any;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiPropertyOptional({ enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] })
    @IsEnum(['DRAFT', 'ACTIVE', 'INACTIVE'])
    @IsOptional()
    status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
}

export class UpdateProductDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    salePrice?: number;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiPropertyOptional()
    @IsOptional()
    attributes?: any;

    @ApiPropertyOptional({ enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] })
    @IsEnum(['DRAFT', 'ACTIVE', 'INACTIVE'])
    @IsOptional()
    status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
}

export class UpdateStockDto {
    @ApiProperty({ example: 50 })
    @IsNumber()
    @Min(0)
    stock: number;
}

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: ['PROCESSING', 'SHIPPED', 'DELIVERED'] })
    @IsEnum(['PROCESSING', 'SHIPPED', 'DELIVERED'])
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    trackingNumber?: string;
}

export class AddProductImagesDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    images: string[];
}
