import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdfService } from '../services/pdf.service';
import { JwtAuthGuard } from 'src/feat/auth/guards/jwtguard';
import puppeteer from 'puppeteer';

@Controller('/prontuario')
export class PdfGenerator {
    constructor(
        private service: PdfService
    ) {}

    @Get('/generatePdf/:id')
    @ApiTags('Prontuario')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async generatePdf(@Param('id') id: string, @Res() res: Response) {
        const response = await this.service.generatePdf(id);
        if (typeof response !== 'string') {
            const { htmlContent, nome } = response;
            try {
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = await browser.newPage();
                await page.setContent(htmlContent, {
                    waitUntil: 'networkidle0',
                    timeout: 60000,
                });
                const pdfBuffer = await page.pdf({ format: 'A4' });
                await browser.close();

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
