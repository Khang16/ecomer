import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UploadType } from 'src/common/decorators/upload-type.decorator';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { UserLevel } from 'src/common/enums/user/user.enum';
import { MediaInterceptor } from 'src/common/interceptors/file.interceptor';
import { multerConfig } from 'src/common/utils/multer-config.util';
import {
  CreateProductCommand,
  DeleteProductCommand,
  UpdateProductCommand,
} from './commands/implements/product.command';
import { CreateProductDto } from './dto/create-product.dto';
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
  @UploadType(TypeMedia.PRODUCT_IMAGE_DETAIL)
  @ApiOperation({ summary: 'Thêm mới sản phẩm, upload nhiều ảnh và video' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Sản phẩm đã được tạo.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerConfig('products', 'product'),
    ),
    MediaInterceptor,
  )
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.commandBus.execute(
      new CreateProductCommand(createProductDto),
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
  @UploadType(TypeMedia.PRODUCT_IMAGE_DETAIL)
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerConfig('products', 'product'),
    ),
    MediaInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    return await this.commandBus.execute(
      new UpdateProductCommand(+id, updateProductDto),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteProductCommand(+id));
  }
}
