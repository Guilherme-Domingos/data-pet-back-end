import { ApiProperty } from '@nestjs/swagger';


export class CreateVeterinarioDto {
  @ApiProperty()

  nome: string;

  @ApiProperty()

  cpf: string; 

  @ApiProperty()

  crmv: string;

  @ApiProperty()

  data_nascimento: Date;

  @ApiProperty()

  endereco: string;

  @ApiProperty()

  telefone: string;

  @ApiProperty()

  email: string;

  @ApiProperty()
  senha: string;

  @ApiProperty({ required: false })

  data_exclusao?: Date;

}
