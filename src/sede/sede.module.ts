import { Module } from '@nestjs/common';
import { SedeService } from './sede.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { SedeController } from './sede.controller';

@Module({
  providers: [SedeService],
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  controllers: [SedeController],
})
export class SedeModule {}
