import { Controller, Delete, HttpException, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { error } from "console";
import { PrismaService } from "src/prisma/service";

@Controller('/prontuario')
export class deleteProntuario{
    constructor(private prisma: PrismaService){}

    @Delete('/deleteProntuario')
    @ApiTags('Prontuario')
    async deleteProntuario(@Query('id') id:string){
        console.log(id)
        const idNumber = parseInt(id);
        try{

            const a =this.prisma.prontuario.delete({
                where: {id: idNumber},
            })
        return a
        }catch(e){
            throw new HttpException(
                {
                    message: 'Plant not found',
                    statuscode: 404,
                    error: e,
                },
                404
            );
        }

    }
}