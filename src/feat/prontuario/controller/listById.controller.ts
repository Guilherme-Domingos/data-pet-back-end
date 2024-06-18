import { Controller, Get, HttpException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "src/prisma/service";

@Controller('/prontuario')
export class ListById{
    constructor(private prisma:PrismaService) {}

    @Get('/listById/:id')
    @ApiTags('Prontuario')
    async listById(@Param('id') id:string){
        try{
            const numberId = parseInt(id)
        
        const response = await this.prisma.prontuario.findUnique({
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
        });
        if(!response){
            throw new HttpException(
                {
                    message: 'Prontuario not found',
                },
                404
            );
        }
        return response;
        }catch(error){
            console.error(error);
            throw new HttpException(
                {
                    message: 'Failed to list prontuario',
                    error: error,
                },
                404
            );
        }
    }

}