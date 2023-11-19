import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  providers: [SupermercadoService],
})
export class SupermercadoModule {}
