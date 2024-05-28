import { ApiProperty } from "@nestjs/swagger";

export class AnimalDTO {

    
    @ApiProperty()
    nome: string;

    @ApiProperty()
    idade: number;

    @ApiProperty()
    especie: string;

    @ApiProperty()
    peso: number;

    @ApiProperty()
    raca: string;

    @ApiProperty()
    porte: string;

    @ApiProperty()
    sexo: string;

    @ApiProperty()
    data_nascimento: Date;


    tutorId?: number;

    @ApiProperty()
    data_cadastro: Date;

    @ApiProperty()
    data_atualizacao: Date;

    @ApiProperty()
    data_exclusao?: Date;
}
