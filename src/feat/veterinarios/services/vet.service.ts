import { PrismaService } from 'src/prisma/service';
import { CreateVeterinarioDto } from '../DTOs/veterinariosDTO';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class VetService {
    constructor(private prisma: PrismaService) {}

    async setRole(vetId: number) {
        try {
            return await this.prisma.roles.create({
                data: {
                    idVeterinario: vetId,
                    role: Role.VETERINARIO,
                },
            });
        } catch (error) {
            throw new HttpException(
                'Erro ao definir role do veterinário',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async createVet(createVeterinarioDto: CreateVeterinarioDto) {
        const { nome, crmv, telefone, email, endereco, cpf, data_nascimento, senha } =
            createVeterinarioDto;

        try {
            const response =  await this.prisma.veterinario.create({
                data: {
                    nome,
                    crmv,
                    telefone,
                    email,
                    endereco,
                    cpf,
                    data_nascimento,
                    senha
                },
            });
            this.setRole(response.id);
            return response;
        } catch (error) {
            throw new HttpException(
                'Erro ao criar veterinário',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async listAllVets() {
        return await this.prisma.veterinario.findMany();
    }
}
