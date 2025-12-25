import { Module } from '@nestjs/common';
import {
    DashboardController,
    VendorsController,
    CategoriesController,
    CustomersController,
    AdminProductsController,
} from './controllers';
import {
    DashboardService,
    VendorsService,
    CategoriesService,
    CustomersService,
    AdminProductsService,
} from './services';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [DashboardController, VendorsController, CategoriesController, CustomersController, AdminProductsController],
    providers: [DashboardService, VendorsService, CategoriesService, CustomersService, AdminProductsService],
    exports: [DashboardService, VendorsService, CategoriesService, CustomersService, AdminProductsService],
})
export class AdminModule { }

