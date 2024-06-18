import { Module } from '@nestjs/common';
import { AuthModule } from './feat/auth/auth.module';
import { AnimalModule } from './feat/animais/animal.module';
import { ProntuarioModule } from './feat/prontuario/prontuario.module';
import { VeterinariosModule } from './feat/veterinarios/veterinarios.module';
import { ConsultaModule } from './feat/consulta/consulta.module';
import { AdminModule } from './feat/administracao/admin.module';

@Module({
    imports: [AuthModule, AnimalModule, ProntuarioModule, VeterinariosModule, ConsultaModule, AdminModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
