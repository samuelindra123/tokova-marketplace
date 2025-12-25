import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { AddToCartDto, UpdateCartDto } from '../dto';

@ApiTags('Customer - Cart')
@ApiBearerAuth()
@Controller('customer/cart')
@UseGuards(RolesGuard)
@Roles('CUSTOMER')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get cart' })
    async getCart(@CurrentUser('id') userId: string) {
        return this.cartService.getCart(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Add to cart' })
    async addToCart(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
        return this.cartService.addToCart(userId, dto.productId, dto.quantity);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    async updateQuantity(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateCartDto,
    ) {
        return this.cartService.updateQuantity(userId, id, dto.quantity);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove from cart' })
    async removeItem(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.cartService.removeItem(userId, id);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear cart' })
    async clearCart(@CurrentUser('id') userId: string) {
        return this.cartService.clearCart(userId);
    }
}
