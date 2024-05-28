import { ApiProperty } from "@nestjs/swagger";

export class userDTO{
    @ApiProperty()
    nome: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    senha: string;
    @ApiProperty()
    cpf: string;
    @ApiProperty()
    endereco: string;
    @ApiProperty()
    telefone: string;
    @ApiProperty()
    data_nascimento: Date;
    @ApiProperty()
    data_cadastro: Date;
    @ApiProperty()
    data_atualizacao: Date;
    @ApiProperty()
    data_exclusao: Date;
}