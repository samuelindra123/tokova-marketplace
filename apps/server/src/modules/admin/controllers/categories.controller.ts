import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from '../services/categories.service';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

@ApiTags('Admin - Categories')
@ApiBearerAuth('JWT-auth')
@Controller('admin/categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'List all categories' })
    @ApiQuery({ name: 'includeInactive', required: false })
    async findAll(@Query('includeInactive') includeInactive?: boolean) {
        return this.categoriesService.findAll({ includeInactive });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category details' })
    async findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create category' })
    async create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update category' })
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete category' })
    async delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }
}
