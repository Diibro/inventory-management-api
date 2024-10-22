import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EventLogModule } from 'src/event-log/event-log.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]), EventLogModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
