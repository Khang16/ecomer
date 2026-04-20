import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Product } from 'src/common/entities/product.entity';
import { Media } from 'src/common/entities/media.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductCommandHandlers } from './commands/handlers';
import { ProductQueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Media]), CqrsModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ...ProductCommandHandlers,
    ...ProductQueryHandlers,
  ],
})
export class ProductModule {}
