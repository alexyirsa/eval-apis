import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadService],
})
export class CiudadModule {}
