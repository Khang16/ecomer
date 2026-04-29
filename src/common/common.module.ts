import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaService } from './services/media.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [MediaService],
  exports: [MediaService],
})
export class CommonModule {}
