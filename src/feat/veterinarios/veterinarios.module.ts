import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import { VeterinariosController } from "./controllers/createVet.controller";
import { VetService } from "./services/vet.service";

@Module({
    imports: [],
    controllers: [VeterinariosController],
    providers: [PrismaService, VetService],
})
export class VeterinariosModule {}