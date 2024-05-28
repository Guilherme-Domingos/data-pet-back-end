import { Injectable } from '@nestjs/common';
import { AnimalDTO } from '../DTOs/animal.dto';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class AnimalService {
    constructor(private prisma: PrismaService) {}

    async create(data: AnimalDTO) {
        console.log(data);
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
                    tutorId: data.tutorId,
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
}
