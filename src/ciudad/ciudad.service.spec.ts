import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';

import { Repository } from 'typeorm/repository/Repository';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { CiudadEntity } from './ciudad.entity';

describe('CiudadService', () => {
  let service: CiudadService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<CiudadEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
