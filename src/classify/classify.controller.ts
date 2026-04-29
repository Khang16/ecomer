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
import {
  CreateClassifyCommand,
  DeleteClassifyCommand,
  UpdateClassifyCommand,
} from './commands/implements/classify.command';
import { CreateClassifyDto } from './dto/create-classify.dto';
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
  @UploadType(TypeMedia.CLASSIFY_THUMBNAIL)
  @ApiOperation({ summary: 'Thêm mới classify với ảnh' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', multerConfig('classifies', 'classify')),
    MediaInterceptor,
  )
  async create(@Body() createClassifyDto: CreateClassifyDto) {
    return await this.commandBus.execute(
      new CreateClassifyCommand(createClassifyDto),
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
  @UploadType(TypeMedia.CLASSIFY_THUMBNAIL)
  @ApiOperation({ summary: 'Cập nhật classify' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', multerConfig('classifies', 'classify')),
    MediaInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateClassifyDto: Partial<CreateClassifyDto>,
  ) {
    return await this.commandBus.execute(
      new UpdateClassifyCommand(+id, updateClassifyDto),
    );
  }

  @Delete(':id')
  @Roles(UserLevel.ADMIN)
  @ApiOperation({ summary: 'Xóa classify' })
  async remove(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteClassifyCommand(+id));
  }
}
