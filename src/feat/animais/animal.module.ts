import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import { AnimalService } from "./services/animal.service";
import { animalController } from "./controllers/animal.controller";
import { JwtAuthGuard } from "../auth/guards/jwtguard";

@Module({
    imports: [],
    controllers: [animalController],
    providers: [PrismaService, AnimalService, JwtAuthGuard],
})
export class AnimalModule {}
