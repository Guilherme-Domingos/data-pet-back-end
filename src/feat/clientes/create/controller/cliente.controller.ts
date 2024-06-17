import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { userDTO } from '../../DTOs/user.dtos';
import e from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { userServices } from '../services/user.service';
import { JwtAuthGuard } from '../../../auth/guards/jwtguard';
import { AdminAuthGuard } from 'src/feat/auth/guards/adminguard';
import { VetAuthGuard } from 'src/feat/auth/guards/vetguard';
import { ClienteDTO } from '../../DTOs/cliente.DTO';

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

    @Get('/getAllUsers')
    @ApiTags('cliente')
    @ApiBearerAuth()
    @UseGuards(VetAuthGuard)
    async listAll() {
        return await this.prisma.cliente.findMany();
    }

    @Put('/edit/:id')
    @ApiTags('Cliente')
    async editData(@Body() data: ClienteDTO, @Param('id') id: string) {
        const idNumber = parseInt(id);
        const filteredData = {};

        // Filtrar os campos que não são undefined ou null
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                filteredData[key] = data[key];
            }
        }

        try {
            const response = await this.prisma.cliente.update({
                where: {
                    id: idNumber,
                },
                data: filteredData,
            });
            return response;
        } catch (e) {
            throw new HttpException(
                'Erro ao atualizar dados',
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
