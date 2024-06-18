import { PrismaService } from "src/prisma/service";
import { AdminDTO } from "../DTOs/adminDTO";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService){}

    async setRole(adminId: number) {
        try {
            return await this.prisma.roles.create({
                data: {
                    idAdministrador: adminId,
                    role: Role.ADMINISTRADOR,
                },
            });
        } catch (error) {
            throw new HttpException(
                'Erro ao definir role do administrador',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async createAdmin(data: AdminDTO) {
        const { cpf, data_nascimento, email, endereco, nome, senha, telefone} = data;
        const response = await this.prisma.administrador.create({
            data: {
                nome: nome,
                email: email,
                senha: senha,
                cpf: cpf,
                data_nascimento: data_nascimento,
                endereco: endereco,
                telefone: telefone,
                
            },
        });
        this.setRole(response.id);
        return response;
    }
    async findAdmins() {
        return this.prisma.administrador.findMany();
    }
    async findAdminById(id) {
        return this.prisma.administrador.findUnique({
            where: {
                id: id,
            },
        });
    }
    async updateAdmin(id: string, data) {
        const { name, email, password } = data;
        const idNumber = parseInt(id);
        return this.prisma.administrador.update({
            where: {
                id: idNumber,
            },
            data: {
                nome: data.name,
                email: data.email,
                senha: data.password,
            },
        });
    }
    async deleteAdmin(id) {
        return this.prisma.administrador.delete({
            where: {
                id: id,
            },
        });
    }
}