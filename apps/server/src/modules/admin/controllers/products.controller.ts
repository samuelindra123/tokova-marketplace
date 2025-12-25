import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminProductsService } from '../services/products.service';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';

@ApiTags('Admin - Products')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminProductsController {
    constructor(private readonly productsService: AdminProductsService) { }

    @Get()
    @ApiOperation({ summary: 'List all products' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll({ page, limit, search });
    }
}
