import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { userDTO } from '../../DTOs/user.dtos';
import e from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { userServices } from '../services/user.service';
import { JwtAuthGuard } from '../../../auth/guards/jwtguard';

@Controller('/cliente')
export class createUser {
    constructor(
        private prisma: PrismaService,
        private service: userServices
    ) {}
    @Post('/createCliente')
    @HttpCode(201)
    @ApiTags('Cliente')
    async createUser(@Body() body: userDTO) {
        const {
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
        } = body;

        try {
            const user = await this.service.createUser({
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
            });
            return { message: 'User created', user };
        } catch (e) {
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


    @Get('/getUser')
    @ApiTags('Cliente')
    async getUser(@Query('id') id: string) {
        const idNumber = parseInt(id);
        return await this.prisma.cliente.findUnique({
            where: {
                id: idNumber,
            },
        });
    }
}
