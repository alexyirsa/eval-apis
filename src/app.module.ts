import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { SedeModule } from './sede/sede.module';

@Module({
  imports: [CiudadModule, SupermercadoModule, SedeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
