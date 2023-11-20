import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { SedeService } from './sede.service';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto/supermercado.dto';
import { plainToInstance } from 'class-transformer';

@Controller('sede')
@UseInterceptors(BusinessErrorsInterceptor)
export class SedeController {
  private readonly logger = new Logger(SedeController.name);
  constructor(private readonly sedeService: SedeService) {}

  @Post(':cityId/supermarket/:supermarketId')
  async addSupermarketToCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    this.logger.debug('addSupermarketToCity');
    return await this.sedeService.addSupermarketToCity(cityId, supermarketId);
  }

  @Get(':cityId/supermarket')
  async findSupermarketsFromCity(@Param('cityId') cityId: string) {
    this.logger.debug('findSupermarketsFromCity');
    return await this.sedeService.findSupermarketsFromCity(cityId);
  }

  @Get(':cityId/supermarket/:supermarketId')
  async findSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    this.logger.debug('findSupermarketFromCity');
    return await this.sedeService.findSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }

  @Put(':cityId/supermarket')
  async updateSupermarketsFromCity(
    @Param('cityId') cityId: string,
    @Body() supermercadoDto: SupermercadoDto[],
  ) {
    this.logger.debug('updateSupermarketsFromCity');
    const supermercado: SupermercadoEntity[] = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.sedeService.updateSupermarketsFromCity(
      cityId,
      supermercado,
    );
  }

  @Delete(':cityId/supermarket/:supermarketId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    this.logger.debug('deleteSupermarketFromCity');
    return await this.sedeService.deleteSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }
}
