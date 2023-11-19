import { Test, TestingModule } from '@nestjs/testing';
import { SedeService } from './sede.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SedeService', () => {
  let service: SedeService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let ciudadRepository: Repository<CiudadEntity>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let supermercadoRepository: Repository<SupermercadoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SedeService],
    }).compile();

    service = module.get<SedeService>(SedeService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
