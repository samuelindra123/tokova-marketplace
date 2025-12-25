import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CurrentUser, Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { CreateProductDto, UpdateProductDto, UpdateStockDto, AddProductImagesDto } from '../dto';

@ApiTags('Vendor - Products')
@ApiBearerAuth()
@Controller('vendor/products')
@UseGuards(RolesGuard)
@Roles('VENDOR')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'List vendor products' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(
        @CurrentUser('id') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll(userId, { page, limit, status, search });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product details' })
    async findOne(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ) {
        return this.productsService.findOne(userId, id);
    }

    @Post()
    @ApiOperation({ summary: 'Create product' })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateProductDto,
    ) {
        return this.productsService.create(userId, dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update product' })
    async update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productsService.update(userId, id, dto);
    }

    @Put(':id/stock')
    @ApiOperation({ summary: 'Update product stock' })
    async updateStock(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateStockDto,
    ) {
        return this.productsService.updateStock(userId, id, dto.stock);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product' })
    async delete(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ) {
        return this.productsService.delete(userId, id);
    }

    @Post(':id/images')
    @ApiOperation({ summary: 'Add product images' })
    async addImages(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: AddProductImagesDto,
    ) {
        return this.productsService.addImages(userId, id, dto.images);
    }

    @Delete(':id/images/:imageId')
    @ApiOperation({ summary: 'Delete product image' })
    async deleteImage(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Param('imageId') imageId: string,
    ) {
        return this.productsService.deleteImage(userId, id, imageId);
    }
}
