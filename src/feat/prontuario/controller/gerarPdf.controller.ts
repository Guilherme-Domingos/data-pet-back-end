import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdfService } from '../services/pdf.service';
import { JwtAuthGuard } from 'src/feat/auth/guards/jwtguard';

@Controller('/prontuario')
export class PdfGenerator {
    constructor(private service: PdfService) {}

    @Get('/generatePdf/:id')
    @ApiTags('Prontuario')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async generatePdf(@Param('id') id: string, @Res() res: Response) {
        const response = await this.service.generatePdf(id);
        if (typeof response !== 'string') {
            try {
                const { nome, pdfBuffer } = response;
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=${nome}.pdf`,
                    'Content-Length': pdfBuffer.length,
                });
                res.send(pdfBuffer);
            } catch (error) {
                console.error('Error generating PDF:', error);
                res.status(500).send({
                    message: 'Erro ao gerar PDF',
                    error: error,
                });
            }
        }
    }
}
