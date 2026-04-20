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
import { CreateBrandDto } from './dto/create-brand.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBrandCommand } from './commands/implements/create-brand.command';
import {
  GetBrandQuery,
  GetBrandsQuery,
} from './queries/implements/get-brands.query';
import { UpdateBrandCommand } from './commands/implements/update-brand.command';
import { DeleteBrandCommand } from './commands/implements/delete-brand.command';

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
  @ApiOperation({ summary: 'Thêm mới brand với ảnh đại diện' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/brands',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `brand-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new CreateBrandCommand(createBrandDto, image),
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
  @ApiOperation({ summary: 'Cập nhật brand' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/brands',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `brand-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: Partial<CreateBrandDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new UpdateBrandCommand(+id, updateBrandDto, image),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa brand' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteBrandCommand(+id));
  }
}
