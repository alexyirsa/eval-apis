import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { Repository } from 'typeorm/repository/Repository';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { faker } from '@faker-js/faker';
import { CiudadEntity } from './ciudad.entity';

describe('CiudadService', () => {
  let service: CiudadService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    // eslint-disable-next-line prettier/prettier
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        name: faker.company.name(),
        country: faker.location.country().toString(),
        people: faker.number.int(),
      });
      ciudadList.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCiudad: CiudadEntity = ciudadList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.name).toEqual(storedCiudad.name);
    expect(ciudad.country).toEqual(storedCiudad.country);
    expect(ciudad.people).toEqual(storedCiudad.people);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      name: faker.company.name(),
      country: 'Argentina',
      people: faker.number.int(),
      supermercados: [],
    };
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: newCiudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.name).toEqual(newCiudad.name);
    expect(storedCiudad.country).toEqual(newCiudad.country);
    expect(storedCiudad.people).toEqual(newCiudad.people);
  });

  it('update should modify a city', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    ciudad.name = 'New name';
    ciudad.country = 'New country';
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.name).toEqual(ciudad.name);
    expect(storedCiudad.country).toEqual(ciudad.country);
  });

  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
