import { Test, TestingModule } from '@nestjs/testing';
import { SedeService } from './sede.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SedeService', () => {
  let service: SedeService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let ciudadRepository: Repository<CiudadEntity>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList: SupermercadoEntity[];

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
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          name: faker.company.name(),
          length: faker.location.longitude().toString(),
          latitude: faker.location.latitude().toString(),
          webPage: faker.lorem.text().toString(),
          ciudades: [],
        });
      supermercadosList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      name: faker.company.name(),
      country: faker.location.country().toString(),
      people: faker.number.int(),
      supermercados: supermercadosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSuperToCity should throw an exception for an invalid super', async () => {
    const newCity: CiudadEntity = await ciudadRepository.save({
      name: faker.company.name(),
      country: faker.location.country().toString(),
      people: faker.number.int(),
      supermercados: supermercadosList,
    });
    await expect(() =>
      service.addSupermarketToCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The super with the given id was not found',
    );
  });

  it('deleteSuperFromCity should remove a super from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const deletedSupermercado: SupermercadoEntity =
      storedCiudad.supermercados.find((m) => m.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSuperFromCity should thrown an exception for an invalid super', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The super with the given id was not found',
    );
  });
});
