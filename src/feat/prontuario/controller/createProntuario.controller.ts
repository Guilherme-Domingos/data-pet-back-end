import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { prontuarioDTO } from '../DTO/prontuarioDTO';
import { ApiTags } from '@nestjs/swagger';

@Controller('/prontuario')
export class CreateProntuarioController {
  constructor(private prisma: PrismaService) {}

  @Post('/createProntuario')
  @ApiTags('Prontuario')
  async createProntuario(@Body() body: prontuarioDTO) {
    const {
      cpfTutor,
      nome,
      porteFisico,
      raca,
      tutor,
      vacinas,
      email,
      endereco,
      sexo,
      telefone,
      doencas,
      data_cadastro,
      data_exclusao,
      data_nascimento,
      data_atualizacao,
    } = body;

    try {
      // const prontuario = await this.prisma.prontuario.create({
      //   data: {
      //     cpfTutor,
      //     porteFisico,
      //     raca,
      //     tutor,
      //     vacinas,
      //     doencas,
      //     data_atualizacao,
      //     data_nascimento,
      //     email,
      //     endereco,
      //     nome,
      //     sexo,
      //     telefone,
      //     data_cadastro,
      //     data_exclusao,
      //   },
      // });
      // return prontuario;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to create prontuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
