import { IsEnum, IsOptional, IsString, IsNumber, Min, Max, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVendorStatusDto {
    @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'SUSPENDED'] })
    @IsEnum(['APPROVED', 'REJECTED', 'SUSPENDED'])
    status: 'APPROVED' | 'REJECTED' | 'SUSPENDED';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    reason?: string;
}

export class UpdateCommissionRateDto {
    @ApiProperty({ example: 10, minimum: 0, maximum: 100 })
    @IsNumber()
    @Min(0)
    @Max(100)
    commissionRate: number;
}

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    parentId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ example: 'Electronics' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    parentId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 0 })
    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}
