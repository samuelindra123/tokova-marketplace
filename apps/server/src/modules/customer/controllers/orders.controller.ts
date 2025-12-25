import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomerOrdersService } from '../services/orders.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { CreateOrderDto } from '../dto';

@ApiTags('Customer - Orders')
@ApiBearerAuth()
@Controller('customer/orders')
@UseGuards(RolesGuard)
@Roles('CUSTOMER')
export class OrdersController {
    constructor(private readonly ordersService: CustomerOrdersService) { }

    @Get()
    @ApiOperation({ summary: 'List orders' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getOrders(
        @CurrentUser('id') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.ordersService.getOrders(userId, { page, limit });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    async getOrder(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.ordersService.getOrder(userId, id);
    }

    @Post()
    @ApiOperation({ summary: 'Create order (checkout)' })
    async createOrder(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(userId, dto);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel order' })
    async cancelOrder(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.ordersService.cancelOrder(userId, id);
    }
}
