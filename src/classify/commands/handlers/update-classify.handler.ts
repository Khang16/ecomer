import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from 'src/common/entities/classify.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { UpdateClassifyCommand } from '../implements/classify.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateClassifyCommand)
export class UpdateClassifyHandler
  implements ICommandHandler<UpdateClassifyCommand>
{
  constructor(
    @InjectRepository(Classify)
    private readonly classifyRepository: Repository<Classify>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: UpdateClassifyCommand): Promise<Classify> {
    const { id, updateClassifyDto, file } = command;

    const classify = await this.classifyRepository.findOne({ where: { id } });
    if (!classify) {
      throw new NotFoundException(`Classify with ID ${id} not found`);
    }

    if (file) {
      let imageMedia = this.mediaRepository.create({
        url: `/uploads/classifies/${file.filename}`,
        type: TypeMedia.CLASSIFY_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
      classify.image_id = imageMedia.id;
    }

    Object.assign(classify, updateClassifyDto);

    return await this.classifyRepository.save(classify);
  }
}
