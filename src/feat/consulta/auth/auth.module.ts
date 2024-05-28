import { Module } from "@nestjs/common";
import { createUser } from "./clientes/create/controller/cliente.controller";
import { PrismaService } from "src/prisma/service";
import { userServices } from "./clientes/create/services/user.service";

@Module({
    imports: [],
    controllers: [createUser],
    providers: [PrismaService, userServices],
})
export class AuthModule {}