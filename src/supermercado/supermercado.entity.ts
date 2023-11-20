import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  length: string;

  @Column()
  latitude: string;

  @Column()
  webPage: string;

  @ManyToMany(() => CiudadEntity, (ciudad) => ciudad.supermercados)
  ciudades: CiudadEntity[];
}
