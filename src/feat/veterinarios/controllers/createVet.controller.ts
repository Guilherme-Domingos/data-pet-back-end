import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { CreateVeterinarioDto } from '../DTOs/veterinariosDTO';
import { ApiTags } from '@nestjs/swagger';
import { VetService } from '../services/vet.service';


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
}
