import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../../auth/guards/localauth';
import { AuthService } from '../../../auth/services/auth.service';
import { authDTO } from '../../../auth/DTOs/auth.dto';
import { Cliente } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/guards/jwtguard';

@Controller('/cliente')
export class authClient {
    private readonly logger = new Logger(authClient.name);
    constructor(private auth: AuthService) {}

    @Post('/authCliente')
    @ApiTags('Cliente')
    @ApiBody({ type: authDTO })
    @UseGuards(LocalAuthGuard)
    async authUser(@Req() req) {
        this.logger.log('Entering authUser method');

        const {
            id,
            email,
            nome,
            senha,
            cpf,
            data_nascimento,
            endereco,
            telefone,
            data_cadastro,
            data_atualizacao,
            data_exclusao,
        } = req.user;

        const data: Cliente = {
            id,
            nome,
            email,
            senha,
            cpf,
            data_nascimento,
            endereco,
            telefone,
            data_cadastro,
            data_atualizacao,
            data_exclusao,
        };

        try {
            return this.auth.login(data);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
