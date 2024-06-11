import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { createConsulta } from './controllers/createConsulta.controller';
import { ListConsulta } from './controllers/listConsulta.controller';

@Module({
    imports: [],
    controllers: [createConsulta, ListConsulta],
    providers: [PrismaService],
})
export class ConsultaModule {}
