import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UseGuards } from '@nestjs/common';

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(RolesGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @Roles('VENDOR', 'ADMIN')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload an image file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                folder: {
                    type: 'string',
                    description: 'Optional folder name (e.g., logos, banners)',
                },
            },
        },
    })
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder?: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Validate file type
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new BadRequestException('Only image files are allowed (JPEG, PNG, GIF, WebP)');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File size must be less than 5MB');
        }

        const result = await this.uploadService.uploadFile(file, folder);

        return {
            success: true,
            ...result,
        };
    }
}
