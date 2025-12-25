import {
    Controller,
    Get,
    Param,
    Query,
    Put,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VendorsService } from '../services/vendors.service';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { UpdateVendorStatusDto, UpdateCommissionRateDto } from '../dto';

@ApiTags('Admin - Vendors')
@ApiBearerAuth('JWT-auth')
@Controller('admin/vendors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Get()
    @ApiOperation({ summary: 'List all vendors' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ) {
        return this.vendorsService.findAll({ page, limit, status, search });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get vendor details' })
    async findOne(@Param('id') id: string) {
        return this.vendorsService.findOne(id);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Update vendor status (approve/reject/suspend)' })
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateVendorStatusDto,
    ) {
        return this.vendorsService.updateStatus(id, dto.status, dto.reason);
    }

    @Put(':id/commission')
    @ApiOperation({ summary: 'Update vendor commission rate' })
    async updateCommissionRate(
        @Param('id') id: string,
        @Body() dto: UpdateCommissionRateDto,
    ) {
        return this.vendorsService.updateCommissionRate(id, dto.commissionRate);
    }
}
