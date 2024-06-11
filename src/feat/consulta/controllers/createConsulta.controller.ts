import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import { CreateConsultaDto } from "../DTOs/consulta.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller('/consulta')
export class createConsulta{
    constructor(private prisma: PrismaService) {}


    @Post('/createConsulta')
    @ApiTags('Consulta')
    async createConsulta(@Body() body: CreateConsultaDto) {
        const { animalId, data_consulta, diagnostico, peso, pressao, prontuarioId, temperatura, veterinarioId } = body;

        try {
            return await this.prisma.consulta.create({
                data: {
                    animalId,
                    data_consulta,
                    diagnostico,
                    peso,
                    pressao,
                    prontuarioId,
                    temperatura,
                    veterinarioId
                }
            });
        } catch (error) {
            throw new HttpException('Erro ao criar consulta', HttpStatus.BAD_REQUEST);
        }


        return 'createConsulta';
    }

}