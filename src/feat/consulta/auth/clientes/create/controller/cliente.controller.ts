import { Body, Controller, HttpCode, HttpException, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import { userDTO } from "../../DTOs/user.dtos";
import e from "express";
import { ApiTags } from "@nestjs/swagger";


@Controller('/cliente')
export class createUser{
    constructor(private prisma: PrismaService){}
    @Post('/createUser')
    @HttpCode(201)
    @ApiTags('Cliente')
    async createUser(@Body() body: userDTO){
        const {cpf, data_atualizacao, data_cadastro, data_exclusao, data_nascimento, email, nome, senha, endereco, telefone} = body;
        try{
            const user = await this.prisma.cliente.create({
                data: {
                    cpf,
                    data_atualizacao,
                    data_cadastro,
                    data_exclusao,
                    data_nascimento,
                    email,
                    nome,
                    senha,
                    endereco,
                    telefone,
                }
                    
            })
            return {message: 'User created', user};
        }catch(error){
            console.error(e);
            throw new HttpException(
                {
                    message: 'User not created',
                    statuscode: 500,
                    error: e,
                },
                500
            );
        }
    }
}