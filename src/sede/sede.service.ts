import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';

import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SedeService {
  supermercado: any;
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async addSupermarketToCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<CiudadEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        'The upermercado with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    ciudad.supermercados = [...ciudad.supermercados, supermercado];
    return await this.ciudadRepository.save(ciudad);
  }

  async findSupermarketsFromCity(
    ciudadId: string,
  ): Promise<SupermercadoEntity[]> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return ciudad.supermercados;
  }

  async findSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<SupermercadoEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const supermercado: SupermercadoEntity = ciudad.supermercados.find(
      (e) => e.id === supermercadoId,
    );
    if (!supermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return supermercado;
  }

  async updateSupermarketsFromCity(
    ciudadId: string,
    supermercado: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    for (let i = 0; i < supermercado.length; i++) {
      const supermercado: SupermercadoEntity =
        await this.supermercadoRepository.findOne({
          where: { id: this.supermercado[i].id },
        });
      if (!supermercado) {
        throw new BusinessLogicException(
          'The supermarket with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }
    ciudad.supermercados = supermercado;
    return await this.ciudadRepository.save(ciudad);
  }

  async deleteSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<void> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(
      (e) => e.id === supermercadoId,
    );
    if (!ciudadSupermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    ciudad.supermercados = ciudad.supermercados.filter(
      (e) => e.id !== supermercadoId,
    );
    await this.ciudadRepository.save(ciudad);
  }
}
