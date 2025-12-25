import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Public } from '../../common/decorators';

@ApiTags('Products')
@Controller('products')
@Public()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'List products' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'categoryId', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'minPrice', required: false })
    @ApiQuery({ name: 'maxPrice', required: false })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['price_asc', 'price_desc', 'newest', 'rating'] })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('sortBy') sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating',
    ) {
        return this.productsService.findAll({
            page,
            limit,
            categoryId,
            search,
            minPrice,
            maxPrice,
            sortBy,
        });
    }

    @Get('categories')
    @ApiOperation({ summary: 'List categories' })
    async getCategories() {
        return this.productsService.getCategories();
    }

    @Get('stores')
    @ApiOperation({ summary: 'List stores' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getStores(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productsService.getStores({ page, limit });
    }

    @Get('stores/:slug')
    @ApiOperation({ summary: 'Get store by slug' })
    async getStoreBySlug(@Param('slug') slug: string) {
        return this.productsService.getStoreBySlug(slug);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get product by slug' })
    async findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }
}
