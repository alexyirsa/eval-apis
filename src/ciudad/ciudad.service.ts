import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class CiudadService {
  ciudad: any;
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({ relations: ['restaurantes'] });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!this.validarPais(ciudad.country)) {
      throw new Error(
        'El país no es válido. Debe ser Argentina, Ecuador o Paraguay.',
      );
    }
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const ciudadIndex = this.ciudad.findIndex((ciudad) => ciudad.id === id);
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!persistedCiudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (ciudadIndex === -1) {
      throw new Error('Ciudad no encontrada.');
    }
    // Validar que el país esté en la lista
    if (!this.validarPais(ciudad.country)) {
      throw new Error(
        'El país no es válido. Debe ser Argentina, Ecuador o Paraguay.',
      );
    }
    return await this.ciudadRepository.save({ ...persistedCiudad, ...ciudad });
  }

  async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.ciudadRepository.remove(ciudad);
  }

  private validarPais(pais: string): boolean {
    const paisesValidos = ['Argentina', 'Ecuador', 'Paraguay'];
    return paisesValidos.includes(pais);
  }
}
