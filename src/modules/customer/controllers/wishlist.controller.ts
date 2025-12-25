import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from '../services/wishlist.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { AddToWishlistDto } from '../dto';

@ApiTags('Customer - Wishlist')
@ApiBearerAuth()
@Controller('customer/wishlist')
@UseGuards(RolesGuard)
@Roles('CUSTOMER')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    @ApiOperation({ summary: 'Get wishlist' })
    async getWishlist(@CurrentUser('id') userId: string) {
        return this.wishlistService.getWishlist(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Add to wishlist' })
    async addToWishlist(@CurrentUser('id') userId: string, @Body() dto: AddToWishlistDto) {
        return this.wishlistService.addToWishlist(userId, dto.productId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove from wishlist' })
    async removeFromWishlist(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.wishlistService.removeFromWishlist(userId, id);
    }
}
