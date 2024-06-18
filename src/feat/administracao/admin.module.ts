import { Module } from "@nestjs/common";
import { AdminController } from "./controllers/admin.controller";
import { PrismaService } from "src/prisma/service";
import { AdminService } from "./services/admin.service";

@Module({
    imports: [],
    controllers: [AdminController],
    providers: [PrismaService, AdminService],
    })
export class AdminModule {}
    