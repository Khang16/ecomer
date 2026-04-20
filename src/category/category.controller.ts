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
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @ApiOperation({ summary: 'Thêm mới category với ảnh' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `category-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new CreateCategoryCommand(createCategoryDto, image),
    );
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
  @ApiOperation({ summary: 'Cập nhật category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `category-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CreateCategoryDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new UpdateCategoryCommand(+id, updateCategoryDto, image),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa category' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteCategoryCommand(+id));
  }
}
