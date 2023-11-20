import { IsNotEmpty, IsString } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly length: string;

  @IsString()
  @IsNotEmpty()
  readonly latitude: string;

  @IsString()
  @IsNotEmpty()
  readonly webpage: string;
}
