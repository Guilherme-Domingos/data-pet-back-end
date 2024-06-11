import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/service";


@Controller('/consulta')
export class ListConsulta{
    constructor(private prisma: PrismaService) {}

    @Get('/listConsulta')
    @ApiTags('Consulta')
    async listConsulta() {
        return this.prisma.consulta.findMany({
            include: {
                animal: true,
                prontuario: true,
                veterinario: true,
            }
        });
    }
}