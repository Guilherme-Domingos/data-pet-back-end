import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cliente, Veterinario } from '@prisma/client';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async validateUser(email: string, senha: string) {
        const vet = await this.prisma.veterinario.findUnique({
            where: {
               email: email,
            },
        });
        if (vet && senha == vet.senha) {
            return vet;
        }
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

    async login(user: Cliente | Veterinario): Promise<{ token: string; userId: number; role: string }> {
        if (user) {
            const payload = { username: user.email };
            const role = await this.prisma.roles.findUnique({
                where: {
                    idCliente: user.id,
                },
            });
            if (role) {
                payload['role'] = 'CLIENTE';
            } else {
                payload['role'] = 'VETERINARIO';
            }
            const token = this.jwt.sign(payload, { secret: process.env.JWT_SECRET });
            return { token: token, userId: user.id, role: payload['role'] };
        }
        throw new UnauthorizedException('User not found');
    }
    
}
