import { Controller, Get, Param, Res } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import * as puppeteer from 'puppeteer';
import { Response } from 'express';
import { ApiTags } from "@nestjs/swagger";

@Controller('/prontuario')
export class PdfGenerator {
    constructor(private prisma: PrismaService) {}

    @Get('/generatePdf/:id')
    @ApiTags('Prontuario')
    async generatePdf(@Param('id') id: string, @Res() res: Response) {
        const prontuario = await this.prisma.prontuario.findUnique({
            where: { id: Number(id) },
            include: {
                tutor: true,
                animal: true
            }
        });

        if (!prontuario) {
            return res.status(404).send('Prontuário não encontrado');
        }
        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    .prontuario { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>Prontuário ID: ${prontuario.id}</h1>
                <div class="prontuario">
                    <p><strong>Doenças:</strong> ${prontuario.doencas}</p>
                    <p><strong>Vacinas:</strong> ${prontuario.vacinas}</p>
                    <h3>Animal</h3>
                    <p><strong>ID:</strong> ${prontuario.animal.id}</p>
                    <p><strong>Nome:</strong> ${prontuario.animal.nome}</p>
                    <h3>Tutor</h3>
                    <p><strong>ID:</strong> ${prontuario.tutor.id}</p>
                    <p><strong>Nome:</strong> ${prontuario.tutor.nome}</p>
                    <p><strong>Email:</strong> ${prontuario.tutor.email}</p>
                    <p><strong>Data de Cadastro:</strong> ${new Date(prontuario.data_cadastro).toLocaleDateString()}</p>
                    <p><strong>Data de Atualização:</strong> ${new Date(prontuario.data_atualizacao).toLocaleDateString()}</p>
                    <p><strong>Data de Exclusão:</strong> ${new Date(prontuario.data_exclusao).toLocaleDateString()}</p>
                </div>
            </body>
            </html>
        `; 
        
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
            const pdfBuffer = await page.pdf({ format: 'A4' });
            await browser.close();
            
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${prontuario.tutor.nome}.pdf`,
                'Content-Length': pdfBuffer.length,
            });
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send({ message: 'Erro ao gerar PDF', error: error});
        }
    }
}
