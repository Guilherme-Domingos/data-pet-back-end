import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { CreateVeterinarioDto } from '../DTOs/veterinariosDTO';
import { ApiTags } from '@nestjs/swagger';


@Controller('/veterinarios')
export class VeterinariosController {
    constructor(private readonly prisma: PrismaService) {}

    @Post('/createVet')
    @ApiTags('Veterinários')
    async createVet(@Body() createVeterinarioDto: CreateVeterinarioDto) {
        const { nome, crmv, telefone, email, endereco, cpf, data_nascimento } = createVeterinarioDto;

        try {
            return await this.prisma.veterinario.create({
                data: {
                    nome,
                    crmv,
                    telefone,
                    email,
                    endereco,
                    cpf,
                    data_nascimento
                }
            });
        } catch (error) {
            throw new HttpException('Erro ao criar veterinário', HttpStatus.BAD_REQUEST);
        }
    }
}
