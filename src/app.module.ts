import { Module } from '@nestjs/common';
import { AuthModule } from './feat/auth/auth.module';
import { AnimalModule } from './feat/animais/animal.module';
import { ProntuarioModule } from './feat/prontuario/prontuario.module';

@Module({
    imports: [AuthModule, AnimalModule, ProntuarioModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
