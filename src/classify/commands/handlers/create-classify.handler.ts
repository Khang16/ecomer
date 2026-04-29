import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from 'src/common/entities/classify.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { CreateClassifyCommand } from '../implements/classify.command';

@CommandHandler(CreateClassifyCommand)
export class CreateClassifyHandler
  implements ICommandHandler<CreateClassifyCommand>
{
  constructor(
    @InjectRepository(Classify)
    private readonly classifyRepository: Repository<Classify>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: CreateClassifyCommand): Promise<Classify> {
    const { createClassifyDto } = command;

    const classify = this.classifyRepository.create(createClassifyDto);

    return await this.classifyRepository.save(classify);
  }
}
