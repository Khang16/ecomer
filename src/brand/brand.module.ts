import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Brand } from 'src/common/entities/brand.entity';
import { Media } from 'src/common/entities/media.entity';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandCommandHandlers } from './commands/handlers';
import { BrandQueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Media]), CqrsModule],
  controllers: [BrandController],
  providers: [BrandService, ...BrandCommandHandlers, ...BrandQueryHandlers],
})
export class BrandModule {}
