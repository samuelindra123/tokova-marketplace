import {
    Controller,
    Get,
    Put,
    Param,
    Query,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from '../services/customers.service';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class UpdateCustomerDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;
}

class UpdateRoleDto {
    @ApiProperty({ enum: ['CUSTOMER', 'VENDOR', 'ADMIN'] })
    @IsEnum(['CUSTOMER', 'VENDOR', 'ADMIN'])
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

class SuspendDto {
    @ApiProperty()
    @IsBoolean()
    suspend: boolean;
}

@ApiTags('Admin - Customers')
@ApiBearerAuth('JWT-auth')
@Controller('admin/customers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    @ApiOperation({ summary: 'List all customers' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        return this.customersService.findAll({ page, limit, search });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get customer details' })
    async findOne(@Param('id') id: string) {
        return this.customersService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update customer info' })
    async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
        return this.customersService.update(id, dto);
    }

    @Put(':id/verify')
    @ApiOperation({ summary: 'Verify customer email' })
    async verify(@Param('id') id: string) {
        return this.customersService.verify(id);
    }

    @Put(':id/suspend')
    @ApiOperation({ summary: 'Suspend or reactivate customer' })
    async suspend(@Param('id') id: string, @Body() dto: SuspendDto) {
        return this.customersService.suspend(id, dto.suspend);
    }

    @Put(':id/role')
    @ApiOperation({ summary: 'Update customer role' })
    async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.customersService.updateRole(id, dto.role);
    }
}

