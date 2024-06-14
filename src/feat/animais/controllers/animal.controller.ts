import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AnimalDTO } from '../DTOs/animal.dto';
import { AnimalService } from '../services/animal.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/feat/auth/guards/jwtguard';
import { z } from 'zod';
import { VetAuthGuard } from 'src/feat/auth/guards/vetguard';


enum Sexo {
    MACHO = 'macho',
    FEMEA = 'femea',
}
const AnimalSchema = z.object({
    nome: z.string(),
    idade: z.number(),
    especie: z.string(),
    peso: z.number(),
    raca: z.string(),
    porte: z.string(),
    sexo: z.nativeEnum(Sexo),
    data_nascimento: z.date(),
    tutorId: z.number().optional(),
    data_cadastro: z.date(),
    data_atualizacao: z.date(),
    data_exclusao: z.date().optional().nullable(),
});


@Controller('animais')
export class animalController {
    constructor(private readonly animalService: AnimalService) {}

    @Get()
    @ApiTags('Animais')
    @ApiBearerAuth()
    @UseGuards(VetAuthGuard)
    async listAll() {
        return this.animalService.listAllAnimals();
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Animais')
    async create(@Body() data: AnimalDTO, @Query('idTutor') id: string) {
        try {
            data.data_nascimento = new Date(data.data_nascimento);
            data.data_cadastro = new Date(data.data_cadastro);
            data.data_atualizacao = new Date(data.data_atualizacao);
            if (data.data_exclusao) {
                data.data_exclusao = new Date(data.data_exclusao);
            }
            
            AnimalSchema.parse(data);
            return await this.animalService.create(data, id);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get(':id')
    @ApiTags('Animais')
    async show(@Param('id') id: string) {
        return this.animalService.listbyId(id);
    }


    @Put(':id')
    @ApiTags('Animais')
    async update(@Param('id') id: string, @Body() data: AnimalDTO) {
        try {
            data.data_nascimento = new Date(data.data_nascimento);
            data.data_cadastro = new Date(data.data_cadastro);
            data.data_atualizacao = new Date(data.data_atualizacao);
            if (data.data_exclusao) {
                data.data_exclusao = new Date(data.data_exclusao);
            }
            AnimalSchema.parse(data);
            return await this.animalService.update(data, id);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiTags('Animais')
    async delete(@Param('id') id: string) {
        return this.animalService.delete(id);
    }

    @Get('/tutor/:id')
    @ApiTags('Animais')
    async listByTutor(@Param('id') id: string) {

        return this.animalService.listbyTutorId(id);
    }
}
