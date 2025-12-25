import { Module } from '@nestjs/common';
import { StoreController, ProductsController, OrdersController, VendorCategoriesController } from './controllers';
import { StoreService, ProductsService, VendorOrdersService, VendorCategoriesService } from './services';

@Module({
    controllers: [StoreController, ProductsController, OrdersController, VendorCategoriesController],
    providers: [StoreService, ProductsService, VendorOrdersService, VendorCategoriesService],
    exports: [StoreService, ProductsService, VendorOrdersService],
})
export class VendorModule { }
