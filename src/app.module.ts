import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { CreateProntuarioController } from './feat/prontuario/controller/createProntuario.controller';
import { listProntuario } from './feat/prontuario/controller/listProntuario.controller';
import { deleteProntuario } from './feat/prontuario/controller/deleteProntuario.controller';
import { AuthModule } from './feat/auth/auth.module';
import { AnimalModule } from './feat/animais/animal.module';
import { ProntuarioModule } from './feat/prontuario/prontuario.module';

@Module({
    imports: [AuthModule, AnimalModule, ProntuarioModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
