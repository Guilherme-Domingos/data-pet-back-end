import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { prontuarioDTO } from '../DTO/prontuarioDTO';
import { ApiTags } from '@nestjs/swagger';

@Controller('/prontuario')
export class CreateProntuarioController {
  private readonly logger = new Logger(CreateProntuarioController.name);
  constructor(private prisma: PrismaService) {}

  @Post('/createProntuario')
  @ApiTags('Prontuario')
  async createProntuario(@Body() body: prontuarioDTO) {
    this.logger.log('Entering createProntuario method');
    const {
      tutorId,
      animalId,
      doencas,
      vacinas,
      data_atualizacao,
      data_cadastro,
      data_exclusao,
    } = body;

    try {
      const prontuario = await this.prisma.prontuario.create({
        data: {
          tutorId,
          animalId,
          doencas,
          vacinas,
          data_atualizacao,
          data_cadastro,
          data_exclusao,
        },
      });
      this.logger.log('Prontuario created');
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
