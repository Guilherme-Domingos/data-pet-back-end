import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { CreateVeterinarioDto } from '../DTOs/veterinariosDTO';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VetService } from '../services/vet.service';
import { AdminAuthGuard } from 'src/feat/auth/guards/adminguard';


@Controller('/veterinarios')
export class VeterinariosController {
    constructor(private readonly service: VetService) {}

    @Post('/createVet')
    @ApiTags('Veterinários')
    async createVet(@Body() createVeterinarioDto: CreateVeterinarioDto) {
        const data = createVeterinarioDto;

        try {
            return await this.service.createVet(data);
        } catch (error) {
            throw new HttpException('Erro ao criar veterinário', HttpStatus.BAD_REQUEST);
        }
    }
    @Get('/listAllVets')
    @ApiTags('veterinarios')
    @UseGuards(AdminAuthGuard)
    @ApiBearerAuth()
    async listAll() {
        return this.service.listAllVets();
    }
}
