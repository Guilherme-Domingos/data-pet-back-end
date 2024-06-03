import { Controller, Delete, HttpException, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { error } from "console";
import { PrismaService } from "src/prisma/service";
import { crudService } from "../services/crud.service";

@Controller('/prontuario')
export class deleteProntuario{
    constructor(private service: crudService){}

    @Delete('/deleteProntuario')
    @ApiTags('Prontuario')
    async deleteProntuario(@Query('id') id:string){
        return this.service.deleteProntuario(id)
    }
}