import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";
import fetch from 'node-fetch';
import * as FormData from 'form-data';
@Injectable()
export class PdfService {
    constructor(private prisma: PrismaService) {}


    async webHook(url: string, pdfBuffer: Buffer, fileName: string) {
        try {
          const form = new FormData();
          form.append('content', 'Novo prontuário gerado');
          form.append('file', pdfBuffer, { filename: fileName });
    
          const response = await fetch(url, {
            method: 'POST',
            headers: form.getHeaders(),
            body: form,
          });
    
          if (!response.ok) {
            throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
          }
    
          const responseData = await response.json();
          return responseData;
        } catch (error) {
          console.error('Error sending webhook:', error);
          return error;
        }
      }
    


    async generatePdf(id: string) {
        const prontuario = await this.prisma.prontuario.findUnique({
            where: { id: Number(id) },
            include: {
                tutor: true,
                animal: true
            }
        });
        const nome = prontuario.tutor.nome;

        if (!prontuario) {
            return 'Prontuário não encontrado';
        }
        const htmlContent = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Prontuário</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .prontuario {
                    margin-bottom: 20px;
                }
                .section {
                    margin-bottom: 10px;
                }
                .section-title {
                    color: #2e86de;
                    font-size: 18px;
                    margin-bottom: 5px;
                }
                .section-content {
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Prontuário Petshop</h1>
                <div class="prontuario">
                    <div class="section">
                        <p class="section-title">Doenças</p>
                        <p class="section-content">${prontuario.doencas}</p>
                    </div>
                    <div class="section">
                        <p class="section-title">Vacinas</p>
                        <p class="section-content">${prontuario.vacinas}</p>
                    </div>
                    <div class="section">
                        <h3 class="section-title">Animal</h3>
                        <p class="section-content"><strong>ID:</strong> ${prontuario.animal.id}</p>
                        <p class="section-content"><strong>Nome:</strong> ${prontuario.animal.nome}</p>
                    </div>
                    <div class="section">
                        <h3 class="section-title">Tutor</h3>
                        <p class="section-content"><strong>ID:</strong> ${prontuario.tutor.id}</p>
                        <p class="section-content"><strong>Nome:</strong> ${prontuario.tutor.nome}</p>
                        <p class="section-content"><strong>Email:</strong> ${prontuario.tutor.email}</p>
                    </div>
                    <div class="section">
                        <p class="section-title">Datas</p>
                        <p class="section-content"><strong>Data de Cadastro:</strong> ${new Date(prontuario.data_cadastro).toLocaleDateString()}</p>
                        <p class="section-content"><strong>Data de Atualização:</strong> ${new Date(prontuario.data_atualizacao).toLocaleDateString()}</p>
                        <p class="section-content"><strong>Data de Exclusão:</strong> ${new Date(prontuario.data_exclusao).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `; 

        return {
            htmlContent,
            nome
        }
    }
}