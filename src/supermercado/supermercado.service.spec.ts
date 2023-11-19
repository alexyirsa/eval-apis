import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<SupermercadoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
