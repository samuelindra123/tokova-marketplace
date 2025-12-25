import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from '../services/dashboard.service';
import { Roles } from '../../../common/decorators';
import { RolesGuard } from '../../../common/guards';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('admin/dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getStats() {
        return this.dashboardService.getStats();
    }
}

