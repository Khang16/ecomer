import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Classify } from 'src/common/entities/classify.entity';
import { Media } from 'src/common/entities/media.entity';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';
import { ClassifyCommandHandlers } from './commands/handlers';
import { ClassifyQueryHandlers } from './queries/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Classify, Media]), CqrsModule],
  controllers: [ClassifyController],
  providers: [
    ClassifyService,
    ...ClassifyCommandHandlers,
    ...ClassifyQueryHandlers,
  ],
})
export class ClassifyModule {}
