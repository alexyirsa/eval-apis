import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadEntity } from './ciudad.entity';
import { CiudadDto } from './ciudad.dto/ciudad.dto';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':cityId')
  async findOne(@Param('cityId') cityId: string) {
    return await this.ciudadService.findOne(cityId);
  }

  @Post()
  async create(@Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  @Put(':cityId')
  async update(
    @Param('cityId') ciudadId: string,
    @Body() ciudadDto: CiudadDto,
  ) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  @Delete(':cityId')
  @HttpCode(204)
  async delete(@Param('cityId') cityId: string) {
    return await this.ciudadService.delete(cityId);
  }
}
