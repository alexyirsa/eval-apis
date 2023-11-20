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
import { SupermercadoService } from './supermercado.service';
import { SupermercadoDto } from './supermercado.dto/supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.supermercadoService.findAll();
  }

  @Get('supermarkedId')
  async findOne(@Param('supermarkedId') supermarkedId: string) {
    return await this.supermercadoService.findOne(supermarkedId);
  }

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.supermercadoService.create(supermercado);
  }

  @Put(':supermarketId')
  async update(
    @Param('supermarketId') supermarketId: string,
    @Body() SupermercadoDto: SupermercadoDto,
  ) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      SupermercadoDto,
    );
    return await this.supermercadoService.update(supermarketId, supermercado);
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermarketId: string) {
    return await this.supermercadoService.delete(supermarketId);
  }
}
