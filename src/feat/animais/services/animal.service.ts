import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnimalDTO } from '../DTOs/animal.dto';
import { PrismaService } from 'src/prisma/service';


@Injectable()
export class AnimalService {
    constructor(private prisma: PrismaService) {}

    async create(data: AnimalDTO, id: string) {
        const numberID = parseInt(id);
        try {
            await this.prisma.animais.create({
                data: {
                    nome: data.nome,
                    especie: data.especie,
                    porte: data.porte,
                    sexo: data.sexo,
                    raca: data.raca,
                    idade: data.idade,
                    peso: data.peso,
                    tutorId: numberID,
                    data_nascimento: data.data_nascimento,
                    data_atualizacao: data.data_atualizacao,
                    data_cadastro: data.data_cadastro,
                    data_exclusao: data.data_exclusao,
                },
            });
            return { message: 'Animal cadastrado com sucesso' };
        } catch (error) {
            return { message: 'Erro ao cadastrar animal', error: error };
        }
    }

    async listAllAnimals() {
        return await this.prisma.animais.findMany();
    }

    async listbyId(id: string) {
        const numberID = parseInt(id);
        try {
            const response = await this.prisma.animais.findMany({
                where: {
                    id: numberID,
                },
            });
            if (response.length === 0) {
                throw new Error('Nenhum animal encontrado');
            }
            return response;
        } catch (error) {
            throw new HttpException('Nenhum animal encontrado', HttpStatus.NOT_FOUND);
        }

    }

    async listbyTutorId(id: string) {
        const numberID = parseInt(id);
        try {
            const response = await this.prisma.animais.findMany({
                where: {
                    tutorId: numberID,
                },
            });
            if (response.length === 0) {
                throw new Error('Nenhum animal encontrado');
            }
            return response;
        } catch (error) {
            throw new HttpException('Nenhum animal encontrado', HttpStatus.NOT_FOUND);
        }
    }

    async update(data: AnimalDTO, id: string) {
        const numberID = parseInt(id);
        console.log(data, id);
        try {
            const reponse = await this.prisma.animais.update({
                where: {
                    id: numberID,
                },
                data: {
                    nome: data.nome,
                    especie: data.especie,
                    porte: data.porte,
                    sexo: data.sexo,
                    raca: data.raca,
                    idade: data.idade,
                    peso: data.peso,
                    tutorId: numberID,
                    data_nascimento: data.data_nascimento,
                    data_atualizacao: data.data_atualizacao,
                    data_cadastro: data.data_cadastro,
                    data_exclusao: data.data_exclusao,
                },
            });
            return reponse;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new HttpException('Animal não encontrado', HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Erro ao atualizar animal', HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: string) {
        const numberID = parseInt(id);
        try {
            const response = await this.prisma.animais.delete({
                where: { id: numberID },
            });
            return response;
        } catch (error) {
            if (error.code === 'P2003') {
                throw new HttpException('Este Animal existe em um prontuario.', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Erro ao deletar animal', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
