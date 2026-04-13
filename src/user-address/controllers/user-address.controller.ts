import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserAddressCommand } from '../commands/implements/create-user-address.command';
import { CreateUserAddressDto } from '../dtos/create-user-address.dto';
import { SeedLocationCommand } from '../commands/implements/seed-location.command';
import {
  GetDistrictsQuery,
  GetProvincesQuery,
  GetWardsQuery,
} from '../queries/implements/get-location.query';
import { GetListUserAddressQuery } from '../queries/implements/get-list-user-address.query';

@ApiTags('User Address')
@Controller('user-address')
export class UserAddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all user addresses with filters' })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  async getAllUserAddress(@Query('id') id?: number, @Query('name') name?: string) {
    return this.queryBus.execute(new GetListUserAddressQuery(id, name));
  }

  @Post()
  @ApiOperation({ summary: 'Create address of user' })
  async createUserAddress(@Body() createUserDto: CreateUserAddressDto) {
    return this.commandBus.execute(
      new CreateUserAddressCommand(createUserDto.user_id, createUserDto),
    );
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed Vietnam location data' })
  async seedLocation() {
    return this.commandBus.execute(new SeedLocationCommand());
  }

  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces' })
  async getProvinces() {
    return this.queryBus.execute(new GetProvincesQuery());
  }

  @Get('districts/:provinceId')
  @ApiOperation({ summary: 'Get districts by province ID' })
  async getDistricts(@Param('provinceId') provinceId: number) {
    return this.queryBus.execute(new GetDistrictsQuery(Number(provinceId)));
  }

  @Get('wards/:districtId')
  @ApiOperation({ summary: 'Get wards by district ID' })
  async getWards(@Param('districtId') districtId: number) {
    return this.queryBus.execute(new GetWardsQuery(Number(districtId)));
  }
}
