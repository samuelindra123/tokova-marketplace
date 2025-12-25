import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from '../services/addresses.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { CreateAddressDto, UpdateAddressDto } from '../dto';

@ApiTags('Customer - Addresses')
@ApiBearerAuth()
@Controller('customer/addresses')
@UseGuards(RolesGuard)
@Roles('CUSTOMER')
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Get()
    @ApiOperation({ summary: 'List addresses' })
    async getAddresses(@CurrentUser('id') userId: string) {
        return this.addressesService.getAddresses(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get address details' })
    async getAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.addressesService.getAddress(userId, id);
    }

    @Post()
    @ApiOperation({ summary: 'Create address' })
    async createAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
        return this.addressesService.createAddress(userId, dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update address' })
    async updateAddress(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.addressesService.updateAddress(userId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete address' })
    async deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.addressesService.deleteAddress(userId, id);
    }
}
