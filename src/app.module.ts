import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { CreateProntuarioController } from './feat/prontuario/controller/createProntuario.controller';
import { listProntuario } from './feat/prontuario/controller/listProntuario.controller';
import { deleteProntuario } from './feat/prontuario/controller/deleteProntuario.controller';
import { createUser } from './feat/consulta/auth/clientes/create/controller/cliente.controller';
import { AuthModule } from './feat/consulta/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CreateProntuarioController, listProntuario, deleteProntuario],
  providers: [PrismaService],
})
export class AppModule {}
