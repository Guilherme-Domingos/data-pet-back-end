import { ApiProperty } from "@nestjs/swagger";

export class prontarioDTO{
    @ApiProperty()
    nome: string;
    @ApiProperty()
    cpfTutor: string;
    @ApiProperty()
    data_nascimento: Date;
    @ApiProperty()
    porteFisico: string;
    @ApiProperty()
    sexo: string;
    @ApiProperty()
    doencas: string;
    @ApiProperty()
    vacinas: string;
    @ApiProperty()
    tutor: string;
    @ApiProperty()
    endereco: string;
    @ApiProperty()
    telefone: string;
    @ApiProperty()
    raca: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    data_atualizacao?: Date;
    @ApiProperty()
    data_cadastro?: Date;
    @ApiProperty()
    data_exclusao?: Date;
}