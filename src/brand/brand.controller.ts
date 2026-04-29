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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
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
import { CreateBrandCommand } from './commands/implements/create-brand.command';
import { DeleteBrandCommand } from './commands/implements/delete-brand.command';
import { UpdateBrandCommand } from './commands/implements/update-brand.command';
import { CreateBrandDto } from './dto/create-brand.dto';
import {
  GetBrandQuery,
  GetBrandsQuery,
} from './queries/implements/get-brands.query';

@ApiTags('brands')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('brands')
export class BrandController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserLevel.ADMIN)
  @UploadType(TypeMedia.BRAND_THUMBNAIL)
  @ApiOperation({ summary: 'Thêm mới brand với ảnh đại diện' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', multerConfig('brands', 'brand')),
    MediaInterceptor,
  )
  async create(@Body() createBrandDto: CreateBrandDto) {
    return await this.commandBus.execute(
      new CreateBrandCommand(createBrandDto),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách brand' })
  async findAll() {
    return await this.queryBus.execute(new GetBrandsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy brand theo id' })
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new GetBrandQuery(+id));
  }

  @Patch(':id')
  @Roles(UserLevel.ADMIN)
  @UploadType(TypeMedia.BRAND_THUMBNAIL)
  @ApiOperation({ summary: 'Cập nhật brand' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', multerConfig('brands', 'brand')),
    MediaInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: Partial<CreateBrandDto>,
  ) {
    return await this.commandBus.execute(
      new UpdateBrandCommand(+id, updateBrandDto),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa brand' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteBrandCommand(+id));
  }
}
