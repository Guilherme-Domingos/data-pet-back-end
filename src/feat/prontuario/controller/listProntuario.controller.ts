import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/feat/auth/guards/jwtguard';
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
