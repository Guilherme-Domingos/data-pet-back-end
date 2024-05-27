import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { CreateProntuarioController } from './feat/prontuario/controller/createProntuario.controller';
import { listProntuario } from './feat/prontuario/controller/listProntuario.controller';

@Module({
  imports: [],
  controllers: [CreateProntuarioController, listProntuario],
  providers: [PrismaService],
})
export class AppModule {}
