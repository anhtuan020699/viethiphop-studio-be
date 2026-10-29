import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersPublicController } from './customers-public.controller';
import { CustomersAdminController } from './customers-admin.controller';

@Module({
  controllers: [CustomersPublicController, CustomersAdminController],
  providers: [CustomersService],
})
export class CustomersModule {}
