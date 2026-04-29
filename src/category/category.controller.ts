import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserLevel } from 'src/common/enums/user/user.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaInterceptor } from 'src/common/interceptors/file.interceptor';
import { UploadType } from 'src/common/decorators/upload-type.decorator';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { multerConfig } from 'src/common/utils/multer-config.util';
import {
  CreateCategoryCommand,
  DeleteCategoryCommand,
  UpdateCategoryCommand,
} from './commands/implements/category.command';
import {
  GetCategoriesQuery,
  GetCategoryQuery,
} from './queries/implements/category.query';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserLevel.ADMIN)
  @UploadType(TypeMedia.CATEGORY_THUMBNAIL)
  @ApiOperation({ summary: 'Thêm mới category với ảnh' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', multerConfig('categories', 'category')),
    MediaInterceptor,
  )
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.commandBus.execute(new CreateCategoryCommand(createCategoryDto));
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách category' })
  async findAll() {
    return await this.queryBus.execute(new GetCategoriesQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy category theo id' })
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new GetCategoryQuery(+id));
  }

  @Patch(':id')
  @Roles(UserLevel.ADMIN)
  @UploadType(TypeMedia.CATEGORY_THUMBNAIL)
  @ApiOperation({ summary: 'Cập nhật category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', multerConfig('categories', 'category')),
    MediaInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CreateCategoryDto>,
  ) {
    return await this.commandBus.execute(
      new UpdateCategoryCommand(+id, updateCategoryDto),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa category' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteCategoryCommand(+id));
  }
}
