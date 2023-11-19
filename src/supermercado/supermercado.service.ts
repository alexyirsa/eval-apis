import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
  supermercado: any;
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}
  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({ relations: ['ciudades'] });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
        relations: ['ciudades'],
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return supermercado;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    if (supermercado.name.length <= 10) {
      throw new Error(
        'El nombre del supermercado debe tener más de 10 caracteres.',
      );
    }
    return await this.supermercadoRepository.save(supermercado);
  }

  async update(
    id: string,
    supermercado: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    const persistedSupermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    const supermercadoIndex = this.supermercado.findIndex((s) => s.id === id);
    if (!persistedSupermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (supermercadoIndex === -1) {
      throw new Error('Supermercado no encontrado.');
    }
    return await this.supermercadoRepository.save({
      ...persistedSupermercado,
      ...supermercado,
    });
  }

  async delete(id: string) {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.supermercadoRepository.remove(supermercado);
  }
}
