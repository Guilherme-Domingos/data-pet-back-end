import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cliente } from '@prisma/client';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async validateUser(email: string, senha: string) {
        const user = await this.prisma.cliente.findUnique({
            where: {
               email: email,
            },
        });
        if (user && senha == user.senha) {
            return user;
        }
        return null;
    }

    async login(user: Cliente) {
        if (user) {
            const payload = { username: user.email};
            const token = this.jwt.sign(payload, { secret: process.env.JWT_SECRET });
            return { token: token, userId: user.id };
        }
    }
}
