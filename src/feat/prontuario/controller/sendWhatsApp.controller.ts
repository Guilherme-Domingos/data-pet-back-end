import { Body, Controller, Param, Post, Query } from "@nestjs/common";
import { PdfService } from "../services/pdf.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('/prontuario')
export class whatsAppHookController {
    constructor(private pdfService: PdfService) {}

    @Post('/sendWhatsApp/:id')
    @ApiTags('Prontuario')
    async sendWhatsApp(@Param('id') id: string, @Query('number') number: string){
        return this.pdfService.webHook(number, id);
    }
}