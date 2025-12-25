import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VendorCategoriesService } from '../services/categories.service';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';

@ApiTags('Vendor - Categories')
@ApiBearerAuth()
@Controller('vendor/categories')
@UseGuards(RolesGuard)
@Roles('VENDOR')
export class VendorCategoriesController {
    constructor(private readonly categoriesService: VendorCategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'List available categories' })
    async findAll() {
        return this.categoriesService.findAll();
    }
}
