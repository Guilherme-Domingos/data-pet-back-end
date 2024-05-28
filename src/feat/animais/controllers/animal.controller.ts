import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AnimalDTO } from "../DTOs/animal.dto";
import { AnimalService } from "../services/animal.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/feat/auth/guards/jwtguard";

@Controller('animais')
export class animalController {
    constructor(private readonly animalService: AnimalService) {}

    
    @Get()
    @ApiTags('Animais')
    async index() {
        return this.animalService
    }


    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Animais')
    async create(@Body() data: AnimalDTO) {
        return this.animalService.create(data)
    }
    @Get(':id')
    @ApiTags('Animais')
    async show(@Param('id') id: string) {
        return this.animalService
    }
    @Put(':id')
    @ApiTags('Animais')
    async update(@Param('id') id: string, @Body() data: AnimalDTO) {
        return this.animalService
    }
    @Delete(':id')
    @ApiTags('Animais')
    async delete(@Param('id') id: string) {
        return this.animalService
    }
}