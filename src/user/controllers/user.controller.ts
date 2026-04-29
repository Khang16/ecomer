import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { DeleteUserCommand } from '../commands/implements/delete-user.command';
import { StoreUserCommand } from '../commands/implements/store-user.command';
import { UpdateUserCommand } from '../commands/implements/update-user.command';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { CreateUserDto } from '../dtos/store-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { GetUsersQuery } from '../queries/implements/find-user.query';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserLevel.ADMIN)
  @Post()
  @UploadType(TypeMedia.USER_AVATAR)
  @ApiOperation({ summary: 'Create user with avatr' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', multerConfig('', 'user')),
    MediaInterceptor,
  )
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new StoreUserCommand(createUserDto));
  }

  @Roles(UserLevel.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Find all user' })
  findAll(@Query() filter: FilterUserDto) {
    return this.queryBus.execute(new GetUsersQuery(filter));
  }

  @Roles(UserLevel.ADMIN)
  @Patch(':id')
  @UploadType(TypeMedia.USER_AVATAR)
  @ApiOperation({ summary: 'Update user' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', multerConfig('', 'user')),
    MediaInterceptor,
  )
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Roles(UserLevel.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
