import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductCategory } from 'src/common/entities/product-categories.entity';
import { Media } from 'src/common/entities/media.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryCommandHandlers } from './commands/handlers';
import { CategoryQueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory, Media]), CqrsModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    ...CategoryCommandHandlers,
    ...CategoryQueryHandlers,
  ],
})
export class CategoryModule {}
