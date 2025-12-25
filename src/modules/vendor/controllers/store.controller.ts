import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from '../services/store.service';
import { VendorOrdersService } from '../services/orders.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { UpdateStoreDto } from '../dto';

@ApiTags('Vendor - Store')
@ApiBearerAuth()
@Controller('vendor/store')
@UseGuards(RolesGuard)
@Roles('VENDOR')
export class StoreController {
    constructor(
        private readonly storeService: StoreService,
        private readonly ordersService: VendorOrdersService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get store profile' })
    async getStore(@CurrentUser('id') userId: string) {
        return this.storeService.getStore(userId);
    }

    @Put()
    @ApiOperation({ summary: 'Update store profile' })
    async updateStore(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateStoreDto,
    ) {
        return this.storeService.updateStore(userId, dto);
    }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get vendor dashboard stats' })
    async getDashboard(@CurrentUser('id') userId: string) {
        return this.ordersService.getAnalytics(userId);
    }

    @Get('queue-position')
    @ApiOperation({ summary: 'Get vendor queue position for pending approval' })
    async getQueuePosition(@CurrentUser('id') userId: string) {
        return this.storeService.getQueuePosition(userId);
    }
}
