import { ApiProperty } from "@nestjs/swagger";

export class AdminDTO {
    @ApiProperty()
    nome: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    senha: string;
    @ApiProperty()
    cpf: string;
    @ApiProperty()
    data_nascimento: Date;
    @ApiProperty()
    endereco: string;
    @ApiProperty()
    telefone: string;
}
