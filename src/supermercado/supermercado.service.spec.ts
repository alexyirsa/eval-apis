import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoService } from './supermercado.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';

import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        name: faker.company.name(),
        length: faker.location.longitude().toString(),
        latitude: faker.location.latitude().toString(),
        webPage: faker.lorem.text().toString(),
      });
      supermercadosList.push(supermercado);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      storedSupermercado.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.name).toEqual(storedSupermercado.name);
    expect(supermercado.length).toEqual(storedSupermercado.length);
    expect(supermercado.latitude).toEqual(storedSupermercado.latitude);
    expect(supermercado.webPage).toEqual(storedSupermercado.webPage);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The super with the given id was not found',
    );
  });

  it('create should return a new supermarket', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      name: faker.company.name(),
      length: faker.location.longitude().toString(),
      latitude: faker.location.latitude().toString(),
      webPage: faker.lorem.text().toString(),
      ciudades: [],
    }
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: newSupermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.name).toEqual(newSupermercado.name);
    expect(storedSupermercado.length).toEqual(newSupermercado.length);
    expect(storedSupermercado.latitude).toEqual(newSupermercado.latitude);
    expect(storedSupermercado.webPage).toEqual(newSupermercado.webPage);
  });

  it('update should modify a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.name = 'New name';
    supermercado.length = 'New foundation date';
    const updatedSupermercado: SupermercadoEntity = await service.update(
      supermercado.id,
      supermercado,
    );
    expect(updatedSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.name).toEqual(supermercado.name);
    expect(storedSupermercado.length).toEqual(supermercado.length);
  });

  it('delete should remove a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The super with the given id was not found',
    );
  });
});
