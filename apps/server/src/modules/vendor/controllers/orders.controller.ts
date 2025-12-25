import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VendorOrdersService } from '../services/orders.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { UpdateOrderStatusDto } from '../dto';

@ApiTags('Vendor - Orders')
@ApiBearerAuth()
@Controller('vendor/orders')
@UseGuards(RolesGuard)
@Roles('VENDOR')
export class OrdersController {
    constructor(private readonly ordersService: VendorOrdersService) { }

    @Get()
    @ApiOperation({ summary: 'List vendor orders' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false })
    async findAll(
        @CurrentUser('id') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: string,
    ) {
        return this.ordersService.findAll(userId, { page, limit, status });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    async findOne(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ) {
        return this.ordersService.findOne(userId, id);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    async updateStatus(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(userId, id, dto.status, dto.trackingNumber);
    }

    @Get('analytics')
    @ApiOperation({ summary: 'Get sales analytics' })
    async getAnalytics(@CurrentUser('id') userId: string) {
        return this.ordersService.getAnalytics(userId);
    }
}
