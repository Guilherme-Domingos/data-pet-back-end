import { ApiProperty } from "@nestjs/swagger";

export class prontuarioDTO{
    @ApiProperty()
    doencas: string;

    @ApiProperty()
    vacinas: string;

    @ApiProperty()
    animalId: number;

    @ApiProperty()
    tutorId: number;

    @ApiProperty()
    veterinarioId: number;

    @ApiProperty()
    data_cadastro: Date;

    @ApiProperty()
    data_atualizacao: Date;

    @ApiProperty({ required: false })
    data_exclusao?: Date;
}