import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/feat/auth/guards/jwtguard';
import { PrismaService } from 'src/prisma/service';
import { crudService } from '../services/crud.service';

@Controller('/prontuario')
export class listProntuario {
    constructor(private service: crudService, private prisma: PrismaService) {}

    @Get('/listProntuario')
    @ApiTags('Prontuario')
    async listProntuario() {
        return this.service.listProntuario();
    }
}
