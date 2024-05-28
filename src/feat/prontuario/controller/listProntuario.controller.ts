import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/service';

@Controller('/prontuario')
export class listProntuario {
  constructor(private prisma: PrismaService) {}

  @Get('/listProntuario')
  @ApiTags('Prontuario')
  async listProntuario() {
    return this.prisma.prontuario.findMany();
  }
}
