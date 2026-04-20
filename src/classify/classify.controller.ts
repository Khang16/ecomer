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
import { CreateClassifyDto } from './dto/create-classify.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  CreateClassifyCommand,
  DeleteClassifyCommand,
  UpdateClassifyCommand,
} from './commands/implements/classify.command';
import {
  GetClassifiesQuery,
  GetClassifyQuery,
} from './queries/implements/classify.query';

@ApiTags('classifies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classifies')
export class ClassifyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Thêm mới classify với ảnh' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/classifies',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `classify-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createClassifyDto: CreateClassifyDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new CreateClassifyCommand(createClassifyDto, image),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách classify' })
  async findAll() {
    return await this.queryBus.execute(new GetClassifiesQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy classify theo id' })
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new GetClassifyQuery(+id));
  }

  @Patch(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Cập nhật classify' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/classifies',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `classify-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateClassifyDto: Partial<CreateClassifyDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new UpdateClassifyCommand(+id, updateClassifyDto, image),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa classify' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteClassifyCommand(+id));
  }
}
