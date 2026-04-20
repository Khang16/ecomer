import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from 'src/common/entities/product-categories.entity';
import { DeleteCategoryCommand } from '../implements/category.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const { id } = command;
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.remove(category);
  }
}
