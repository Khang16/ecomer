import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserLevel } from 'src/common/enums/user/user.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateProductCommand,
  DeleteProductCommand,
  UpdateProductCommand,
} from './commands/implements/product.command';
import {
  GetProductQuery,
  GetProductsQuery,
} from './queries/implements/product.query';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Thêm mới sản phẩm, upload nhiều ảnh và video' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Sản phẩm đã được tạo.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder =
              file.fieldname === 'videos'
                ? './uploads/videos'
                : './uploads/products';
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
  ) {
    return await this.commandBus.execute(
      new CreateProductCommand(createProductDto, files),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  async findAll() {
    return await this.queryBus.execute(new GetProductsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy sản phẩm theo id' })
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new GetProductQuery(+id));
  }

  @Patch(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder =
              file.fieldname === 'videos'
                ? './uploads/videos'
                : './uploads/products';
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
  ) {
    return await this.commandBus.execute(
      new UpdateProductCommand(+id, updateProductDto, files),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteProductCommand(+id));
  }
}
