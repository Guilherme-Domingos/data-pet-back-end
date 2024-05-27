import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { prontarioDTO } from '../DTO/prontuarioDTO';

@Controller('/prontuario')
export class CreateProntuarioController {
  constructor(private prisma: PrismaService) {}

  @Post('/createProntuario')
  async createProntuario(@Body() body: prontarioDTO) {
    const {
      cep,
      cidade,
      cpf,
      data_atualizacao,
      data_nascimento,
      email,
      endereco,
      escolaridade,
      estado,
      estado_civil,
      nome,
      profissao,
      sexo,
      telefone,
      data_cadastro,
      data_exclusao,
    } = body;

    try {
      const prontuario = await this.prisma.prontuario.create({
        data: {
          cep,
          cidade,
          cpf,
          data_atualizacao,
          data_nascimento,
          email,
          endereco,
          escolaridade,
          estado,
          estado_civil,
          nome,
          profissao,
          sexo,
          telefone,
          data_cadastro,
          data_exclusao,
        },
      });
      return prontuario;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to create prontuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
