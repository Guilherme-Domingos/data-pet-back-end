import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import { VeterinariosController } from "./controllers/createVet.controller";

@Module({
    imports: [],
    controllers: [VeterinariosController],
    providers: [PrismaService],
})
export class VeterinariosModule {}