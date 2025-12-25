import { Module } from '@nestjs/common';
import {
    CartController,
    OrdersController,
    WishlistController,
    AddressesController,
} from './controllers';
import {
    CartService,
    CustomerOrdersService,
    WishlistService,
    AddressesService,
} from './services';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [CartController, OrdersController, WishlistController, AddressesController],
    providers: [CartService, CustomerOrdersService, WishlistService, AddressesService],
    exports: [CartService, CustomerOrdersService, WishlistService, AddressesService],
})
export class CustomerModule { }
