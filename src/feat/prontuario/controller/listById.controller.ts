import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "src/prisma/service";

@Controller('/prontuario')
export class ListById{
    constructor(private prisma:PrismaService) {}

    @Get('/listById/:id')
    @ApiTags('Prontuario')
    async listById(@Param('id') id:string){
        const numberId = parseInt(id)

        return this.prisma.prontuario.findUnique({
            where:{
                id:numberId
            },
            include:{
                animal:true,
                Consulta:true,
                tutor:true,
                veterinario:true,
                Vacina:true,
                Servicos:true
            }
        })
    }

}