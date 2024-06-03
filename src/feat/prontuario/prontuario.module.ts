import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import { CreateProntuarioController } from "./controller/createProntuario.controller";
import { listProntuario } from "./controller/listProntuario.controller";
import { deleteProntuario } from "./controller/deleteProntuario.controller";
import { PdfGenerator } from "./controller/gerarPdf.controller";
import { PdfService } from "./services/pdf.service";
import { crudService } from "./services/crud.service";

@Module({
    imports: [],
    controllers: [CreateProntuarioController, listProntuario, deleteProntuario, PdfGenerator],
    providers: [PrismaService, PdfService, crudService],
})
export class ProntuarioModule {}