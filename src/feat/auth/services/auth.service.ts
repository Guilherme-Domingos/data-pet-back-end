import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Administrador, Cliente, Role, Veterinario } from '@prisma/client';
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
        const admin = await this.prisma.administrador.findUnique({
            where: {
               email: email,
            },
        });
        if (admin && senha == admin.senha) {
            return admin;
        }
        return null;
    }

    async login(user: Cliente | Veterinario  | Administrador ): Promise<{ token: string; userId: number; role: string }> {
        if (user) {
            const payload = { username: user.email };
            const cliente = await this.prisma.roles.findUnique({
                where: {
                    idCliente: user.id,
                },
            });
            if(cliente && cliente.role == Role.CLIENTE){
                payload['role'] = 'CLIENTE';
            }
            const vet = await this.prisma.roles.findUnique({
                where: {
                    idVeterinario: user.id,
                },
            });
            if(vet && vet.role == Role.VETERINARIO){
                payload['role'] = 'VETERINARIO';
            }
            const admin = await this.prisma.roles.findUnique({
                where: {
                    idAdministrador: user.id,
                },
            });
            if(admin && admin.role == Role.ADMINISTRADOR){
                payload['role'] = 'ADMIN';
            }
            const token = this.jwt.sign(payload, { secret: process.env.JWT_SECRET });
            return { token: token, userId: user.id, role: payload['role'] };
        }
        throw new UnauthorizedException('User not found');
    }
    
}
