import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
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
                try {
                    await this.service.webHook(
                        'https://discord.com/api/webhooks/1151736781667061883/weV0JF4R4WmGOga5web2mTK4bwX4xsNvZoudRp8keBJknatNRjpuUc7Mzb8SdZAKO_fE',
                        pdfBuffer,
                        `${nome}.pdf`
                    );
                } catch (error) {
                    console.error('Error sending webhook:', error);
                }
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
