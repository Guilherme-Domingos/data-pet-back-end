import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';

@Controller('/prontuario')
export class listProntuario {
  constructor(private prisma: PrismaService) {}

  @Get('/listProntuario')
  async listProntuario() {
    return this.prisma.prontuario.findMany();
  }
}
