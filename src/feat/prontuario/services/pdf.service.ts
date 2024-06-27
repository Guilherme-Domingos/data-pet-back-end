import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import puppeteer from 'puppeteer';


function capitalizeFirstLetter(text: string): string {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

@Injectable()
export class PdfService {
    constructor(private prisma: PrismaService) {}


    async webHook(number: string, id: string) {
        const baseUrl = process.env.CHECKER == 'development' ? 'https://pure-crag-55388-d0bfd4ddccfc.herokuapp.com' : 'https://pure-crag-55388-d0bfd4ddccfc.herokuapp.com'
        try {
            const {nome, pdfBuffer } = await this.generatePdf(id); 
            const nomeFormatted = capitalizeFirstLetter(nome);
            const fileName = `${nomeFormatted}.pdf`;
            const formattedNumber = number + '@c.us';
            const message = `Olá ${nomeFormatted}! segue o prontuário do seu pet! agredecemos a preferência!`;

            const form = new FormData();
            form.append('content', 'Novo prontuário gerado');
            form.append('file', pdfBuffer, { filename: fileName });


            const pdfBase64 = pdfBuffer.toString('base64');

            const sendText = await fetch(
                `${baseUrl}/client/sendMessage/doug`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chatId: formattedNumber,
                        contentType: 'string',
                        content: message,
                    }),
                }
            );

            const responseWhats = await fetch(
                `${baseUrl}/client/sendMessage/doug`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chatId: formattedNumber,
                        contentType: 'MessageMedia',
                        content: {
                            mimetype: 'application/pdf',
                            data: pdfBase64,
                            filename: fileName,
                        },
                    }),
                }
            );

            if (!responseWhats.ok || !sendText.ok) {
                throw new Error(
                    `Erro ao enviar mensagem: ${responseWhats.statusText}, ${sendText.statusText}`
                );
            }

            return { message: 'Mensagem enviada com sucesso', sendFile: responseWhats.statusText, sendText: sendText.statusText};
        } catch (error) {
            throw new HttpException('Erro ao enviar mensagem', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    async generatePdf(id: string) {
        const prontuario = await this.prisma.prontuario.findUnique({
            where: { id: Number(id) },
            include: {
                tutor: true,
                animal: true,
                veterinario: true,
                Consulta: true,
            },
        });

        if(!prontuario) {
            throw new HttpException('Prontuário não encontrado', HttpStatus.NOT_FOUND);
        }

        let htmlConsultas = '';
        if (prontuario && prontuario.Consulta) {
            for (const consulta of prontuario.Consulta) {
                htmlConsultas += `
            <div class="container2">
                <p class="subtitulos">Consulta</p>
                <p><strong>Data:</strong> ${consulta.data_cadastro}</p>
                <p><strong>Diagnóstico:</strong> ${consulta.diagnostico}</p>
                <p><strong>Tratamento:</strong> ${consulta.diagnostico}</p>
                <p><strong>Observações:</strong> ${consulta.pressao}</p>
            </div>
        `;
            }
        }

        const nome = prontuario.tutor.nome;
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Prontuário</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Gwendolyn:wght@400;700&display=swap" rel="stylesheet">

                <style>
            
                    .conteiner{
                        border: 0 ;
                        outline: none;
                        font-size: 15px;
                        background-color: white;
                        border-radius: 10px;
                        text-align: center;
                        margin: 20mm 100mm;
                        padding-bottom: 10px;
                        overflow: hidden; 
                    }

                    .conteiner input{
                        border: 0 ;
                        outline: none;
                    }

                    .conteiner2{   
                        font-size: 12px;
                        background-color: white;
                        border-radius: 5px;
                        border: 3px solid #8b5795;
                        margin-top: 0;
                        margin-bottom: 3mm;
                        overflow: hidden; 
                    }

                    header{
                        text-align: right;
                    }

                    main{
                        text-align: left;
                        margin: 10mm; 
                    }

                    .titulos{
                        font-family: Arial, Helvetica, sans-serif;
                        text-align: left;
                        margin: 0mm 0mm;
                        background-color: #8b5795;
                        border: 1px solid #8b5795;
                        color:white;    
                        padding-left: 2px;
                        padding-right: 2px;
                        padding-bottom: 2px;
                        padding-top: 2px;
                        
                    }

                    .subtitulos{
                        display: flex;
                        margin: 2mm 2mm;
                        margin-bottom: 1px;
                        padding-left: 2px;
                        padding-top: 0px;
                        padding-bottom: 1px ;
                        font-size: 3.5ex; 
                        box-sizing: border-box;
                    }   

                    .subtitulos input{
                        background-color: #ecbdd1;
                        border: 1px solid #ffecf4 ;
                        border-radius: 4px;    
                        font-size: medium;
                        flex: 1;
                        
                    }

                    .radio{
                        margin: 2mm 2mm;
                        margin-bottom: 1px;
                        padding-left: 2px;
                        padding-top: 0px;
                        padding-bottom: 1px ;
                        font-size: 3.5ex; 
                        
                    }

                    .id{
                        font-family: Arial, Helvetica, sans-serif;
                        color: white;
                        border-radius: 40px;
                        border: 3px solid ;
                        padding-left: 2mm;
                        margin-right: 10mm;
                        margin-top: 10mm;
                        background-color: #8b5795;
                    }

                    .img{
                        display: flex;
                        padding-left: 2mm;
                        margin-left: 10mm;
                        margin-right: 10mm;
                        margin-top: 10mm;  
                
                    }

                    input[type=number]::-webkit-inner-spin-button,
                    input[type=number]::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    .gwendolyn-regular {
                        font-family: "Gwendolyn", cursive;
                        font-weight: 400;
                        font-style: normal;
                    }

                    .gwendolyn-bold {
                        font-family: "Gwendolyn", cursive;
                        font-weight: 700;
                        font-style: normal;
                    }
                    
                </style>
            </head>
            <body> 
                
                    <header style="display: flex; justify-content: space-between;">
                        <div class="img" style="width: 50%;"> 
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    id="eiEzgFMJBnY1"
                                    viewBox="0 0 911 737"
                                    width="176"
                                    shape-rendering="geometricPrecision"
                                    text-rendering="geometricPrecision">
                                    <defs>
                                        <radialGradient
                                            id="eiEzgFMJBnY13-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY13-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY13-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY13-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY14-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY14-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY14-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY14-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY15-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY15-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY15-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY15-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY16-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY16-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY16-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY16-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY17-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY17-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY17-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY17-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY18-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY18-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY18-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY18-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY19-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY19-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY19-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY19-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY20-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY20-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY20-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY20-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY21-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY21-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY21-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY21-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY22-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY22-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY22-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY22-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY23-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY23-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY23-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY23-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                        <radialGradient
                                            id="eiEzgFMJBnY24-fill"
                                            cx="0"
                                            cy="0"
                                            r="0.5"
                                            spreadMethod="pad"
                                            gradientUnits="objectBoundingBox"
                                            gradientTransform="translate(0.5 0.5)">
                                            <stop
                                                id="eiEzgFMJBnY24-fill-0"
                                                offset="0%"
                                                stop-color="#fab8d4" />
                                            <stop
                                                id="eiEzgFMJBnY24-fill-1"
                                                offset="0%"
                                                stop-color="rgba(223,96,177,0.6173)" />
                                            <stop
                                                id="eiEzgFMJBnY24-fill-2"
                                                offset="82%"
                                                stop-color="rgba(190,55,144,0.81)" />
                                        </radialGradient>
                                    </defs>
                                    <g transform="translate(.000001 0.000001)">
                                        <path
                                            d="M270.597488,276.681274q-5.45935-.116577-8.56282,27.322571t-18.363373,72.549774q-23.684754,33.310576-24.074265,33.310576t-46.610916,42.141661l-21.676941,14.043457-24.203629,33.805909-25.803925,45.625-11.623008,46.344879-4.588097,38.273346v13.169128l-13.131103-2.023712-22.23325-11.250214L32.87493,618.148007l-9.286802-10.177551-7.872188-7.347229-4.056596-2.167725q-1.182403,5.078553-1.182403,5.53241t5.238999,14.160095l7.872188,15.945313l9.286802,9.174255l16.851231,16.103394l22.23325,15.164917l21.880654,7.926086l29.8646,7.621033l30.268753,2.442871l33.037934-.790405l42.36383-2.588135l35.743012.935669l46.307464-.356292l24.532715-1.044953l10.22464-2.595459l5.888641-6.039368-.532531-8.701111-3.196717-7.322449-4.907654-4.993835q-7.536377-7.208008-7.858154-7.208008t-18.707092-.99237l-13.466858.265014-11.054138.212891-8.299317.915527-7.937469,1.052429q-.545684-1.453491.599457-2.445861t8.974304-8.453979q8.592316-7.609009,8.956848-7.945435t8.372375-7.041749l8.050568-8.234802l3.672333-13.789734-2.047333-13.53836-2.877166-7.394378-5.555939-7.084351-7.876038-5.357972-5.533874-3.025695-7.726105-1.474945-7.414673-1.362885-3.67424-.489563l4.614273-3.885681l11.700378-7.228149l8.034241-4.567017l12.847199-7.898621l10.808166-6.412903l5.47113-5.719848l4.86435-4.873291l2.878113-4.866028l3.134918-4.487854l3.516845,4.094421q5.457582,8.54541,5.434327,8.54541t3.407165,5.659333l3.328308,5.194061.754822,1.472717l3.770874-4.731201l2.820404-4.50061l2.731506-3.316529l1.724091-1.221374l6.111481-2.898865l6.844818-2.794739q5.000732-2.727294,5.000732-2.864257t2.729767-2.118775q1.330993-3.204497,1.379852-3.348144t3.00055-7.044373l2.428741-5.967773l2.408173-3.310791l4.931152-7.65889q4.583421-6.256607,4.729981-6.256607t4.450134-3.10025l1.985748-8.1633-.768554-5.316071l1.19522-9.925964v-8.914185-7.212341l-1.338195-8.635742-1.101593-10.154022v-7.017456l-3.874176-10.914795-4.358124-13.410553-1.293533-9.040772-4.55806-13.824707-3.167755-12.683929-1.973633-8.86026-1.566223-5.903839q-1.032135-3.850372-1.080994-5.076111c-.048859-1.225739-.097718-3.648072-.048859-4.29007s.911668-3.270996,1.129853-3.652679.950958-2.798797.950958-2.82608.615265-1.813476.615265-2.196991q0-.383515,1.973633-4.13913.681061-2.331086,1.014404-2.784882c.333343-.453796,3.032501-3.905304,3.032501-4.054321q0-.149017,3.67891-4.290207q4.524994-3.724655,4.616073-3.724655t1.960144-.432526l6.848908-.442535l2.751556.388214q1.917419,1.585693,4.48291,1.585693t8.039063,1.753449l6.861053,1.725799q1.863952.803345,3.285797.803345t7.841126,0l6.530335-1.927429l7.561889-3.588196l7.508911-4.796844l7.550842-5.996796l6.929077-6.67746l6.817231-10.419891l6.653137-11.376678q1.426727-7.563965,1.426727-8.203217t2.041596-8.980598q2.116363-4.935098,2.116363-5.931527c0-.996429.374818-4.423614.629029-4.637527s.580657-2.459153.580657-3.012421q0-.553268-1.209686-5.217193-5.584686-1.470582-5.584686-2.046845t-5.017487-2.545685q-3.116424-.897689-4.04692-.897689t-7.673874-2.521584l-3.661164-1.219887-9.613098-2.616607-5.620697-.747727-7.387847-2.583465-4.940034-2.434769-3.773651-3.025833-4.235931-5.321915-5.543915-8.857574-5.565064-4.880684-5.933288-5.692177-9.156433-3.572342-9.022644-2.804611-8.724915-2.246147-8.716614-2.877907-9.884002-2.253708-13.579376-1.863434-16.29361-.388672-5.134888.52388q-10.093369,2.690094-11.304779,2.690094c-1.21141,0-8.656113,4.848771-8.848572,4.968201s-4.619019,3.994216-5.388092,4.12326q-.769073.129044-3.866241,3.701386l-1.000855,5.700714l3.452546,7.550827q4.00177,3.347962,4.00177,4.309708c0,.961746.919066,4.999572,3.058776,5.414535q2.13971.414963,5.096528,6.270752l4.122772,2.637772l3.354309.405258l5.703888-2.316101l5.105438-5.363419l2.444107-3.623016l1.987656-3.803116l3.104278-4.953476l2.387757-3.446182l2.333649-.660736l2.043762.497619q.175079.956025.137054,1.023957c-.038025.067932.101439.398652-.461762.927765s-.514923-.115219-1.015472.771179q-.500549.886398-2.057281,3.079223l-3.367707,6.563767-2.166443,4.351425-2.78337,4.874497-1.52945,5.170455-2.157639,3.930329-5.069763,1.951751-3.110168,1.095902-5.217713-1.401718-6.00296-3.097534-2.88147-5.06572-1.519134-3.810303-3.409973-2.725418-2.131439-3.586654-1.512787-.402817-2.766235,1.586715q-1.354614,2.487473-1.805817,2.661652t-2.598084,2.466522l-1.428161,2.292252-3.227723,2.899872-3.010284,2.434753-2.736176,4.861496q-1.803222,6.113328-1.803222,6.198792t-2.845917,2.936355l-2.010834,4.810395-2.661407,4.0401-4.300141,6.835739-3.117797,5.812301-1.621033,5.604218-1.445465,3.102295-1.782227,4.573974-1.681091,5.73703-1.140243,3.816745Z"
                                            transform="translate(.000001 0.000003)"
                                            fill="#864d72"
                                            stroke-width="1.822" />
                                        <path
                                            d="M893.955994,598.123291l-1.949219-7.616455-1.055726-6.911073-.000001-5.079651l5.049316-.000001l4.626836,2.404437l4.56422,4.406833l3.452743,7.748789l1.793486,6.400849l1.158906,3.200896v7.395284v9.468059v6.865021l-1.158906,3.246612-1.689971,4.01219q-.653565,6.032015-.653565,6.16606t-.913696,5.428814l-4.233276,8.794364-2.852662,4.597779-5.535949,8.05957-2.844178,3.167419-4.712646,5.293152-5.666595,4.874695-5.970987,5.091344-5.830948,3.51089-7.44364,3.755737-8.949768,3.456956-9.009155,2.722854-9.114717,1.869171q-5.645415.523468-6.358184.523468c-.712769,0-11.246643.86322-11.246643.928711q0,.065491-8.396118,0-9.050842-.928711-11.003357-.928711t-18.288423-1.025818l-11.658904-.53772-13.170654-.829101-11.689575-.449951-11.133788.461303-14.894777.159058q-9.811462-.049805-10.347656-.024902t-10.575684.051757l-2.487182-.051757-3.545899.274231-1.240478-.249329-1.679282.658691-2.265909.53772-8.914245-.056641-11.540436-.088989-5.629303.172791h-9.651803-4.825612l-1.046938-.172791-3.227386.172791-4.179871.475189-7.296067.138641-9.200118.201721-6.538147.102295-4.673523.072388-2.869751-.174683-2.387329-.340362h-1.87793l-2.913452.460297-4.612366-.460297-1.705444-1.354828.34021-5.989381l2.255798-6.413512l3.402252-4.234192l3.022369-2.940826l4.007264-2.63913l2.564758-1.053833l3.2099-.655945l5.314392-.313537h6.750427h5.91069h7.296067l2.996673-.322815l1.183198-1.2658-.622285-1.383187-4.278503-2.891196-3.722046-2.284036-3.328735-2.984497-1.541363-1.624512-2.611835-2.971313-2.017701-3.755127q-1.882873-2.57361-1.882873-2.667115t-2.528321-2.923339l-1.776672-3.11377-1.713745-3.483887-2.170532-3.356967-1.979981-5.17471-.79541-3.289734v-4.835327l.731629-4.203735l1.02182-5.368042l2.00235-5.370087l1.676208-4.532033.664185-2.327922v-2.591651l-1.664856-1.514672-2.891175-2.167725-1.540161-1.697815-2.930237-.991039-.946411-.854725-.379455.324158-.537049,6.195435v7.202392l-.285095,7.788574-1.096557,8.37085-1.069703,8.411377-1.591247,10.386641-2.095032,8.932878-2.387573,6.576233-3.625427,8.361145q-4.299866,5.80848-4.384522,5.80848c-.084656,0-5.003234,4.441144-5.243408,4.919573q-.240174.478429-6.534973,3.782994l-7.882447,2.15387-6.425781-.737244-3.428833-2.296265-1.180725-5.264831-.141113-5.258606l1.835571-2.960449l5.062368-4.56134l4.278513-2.762149l5.057862-2.582334q.865112-2.550721.865112-2.603882c0-.053161,0-1.707886,0-1.899353q0-.191467,2.732941-3.805664l1.296051-5.803056v-4.274383-6.588882l-1.296051-6.900024-1.151093-6.497559q-1.908019-8.145324-2.063171-8.145324t-2.224243-6.455628l-1.801575-7.100097-1.415833-5.804352q-1.117371-2.135346-1.168762-2.135346t-2.267578-2.500061l-2.577576-.858948-2.501648,1.262147-8.158996,2.420166-4.400513,2.366342-6.072937,2.039969-5.43821,1.347278-2.58076.929882h-1.237316l-4.022217-7.509521-3.569031-3.859629-4.652466-4.964641-5.331238-4.516329-3.268554-2.025734-3.973511-2.380921l2.184082-1.642l5.562987-2.927641l4.826234-2.717771l2.218079-2.100222.927612-3.038208l3.987427-10.18483l1.85852-9.19017.750794-7.291687-.750794-8.717773-2.392822-8.526978-1.160522-8.372034-1.960328-10.726282-.467621-8.710064-1.246703-6.814972-.718415-4.233905.695984-11.177472.493164-8.944397l1.17511-13.061584-.39914-8.629151v-5.484985l-1.257354-6.216095-1.396423-4.165924-1.234986-3.3396-3.947816-4.369568-6.723754-6.759521-5.151825-9.792511-2.101409-9.400665.136993-10.121277l3.627441-5.375763l1.445648-2.407929l2.043152-.116455h2.038483l4.180267-1.508423l4.799561-1.208495l4.832092-1.508515l3.921082-4.182739l7.840293-2.833786l7.748269-1.295762q5.749939,0,6.170593,0c.420654,0,2.304932.482117,2.385376-.029754s.437865-2.918366.978088-3.400879q.540223-.482513,1.509705-2.850739l1.110291-5.309631l2.550598-6.339722h1.617736q.572053,2.420197.572053,3.274689t5.726592,18.690827l1.048157,1.592224l7.091736-2.969086l6.854218-3.989929l4.554718-5.057068l5.808715-5.201935l3.932984-3.20285l2.984741-.899567l3.686279,1.891876l1.069703,7.170609.274841,8.641342-.221314,11.322479-1.642334,8.779755q-2.798462,5.779633-2.798462,6.632843c0,.85321-.929992,4.674011-.929992,4.864746q0,.190735.929992,8.066376l.343445,6.208038-1.273437,4.600372q.258178,5.873474.258178,6.61673t.921997,6.421112l1.018372,4.045349l1.407715,2.953705-.377564,7.566101-1.601684,2.685303-1.101135,4.218567q.393981,3.469909.747558,3.844238c.353577.374329,2.537964,4.087982,2.575989,4.087982s-.410095,1.378448-.410095,2.930481q0,1.552033,1.87793,3.924164q7.108398,4.300171,7.108398,4.40918t7.502746,4.535217q10.072632,2.786437,10.072632,3.630676c0,.844239,9.441102,2.666962,10.162293,2.666962s12.523438,5.480103,12.536255,5.480103s7.612243,3.633636,8.063232,3.633636q.450989,0,11.344849,6.092224l9.307617,5.287171l10.911621,6.240936l16.229126,12.80011l9.283997,7.017975l7.808349,8.144531l6.671082,7.724609l6.883545,7.358002l6.265442,7.684402l4.467163,10.18483l5.08902,7.995667q4.231658,6.869712,4.231658,7.853271c0,.983559,3.002045,9.461163,3.002045,10.464529q0,1.003366,2.98703,15.295847l1.060425,10.966278.35498,9.358978-.35498,18.368484-1.060425,13.548264q0,10.334838,0,11.158142t2.091614,4.129456l6.726715.842874l9.264374,2.350119l22.771179,4.482361h20.103515l18.470704-2.558097l12.000732-4.688088l8.32898-3.735321l7.611633-4.561038l6.184875-4.909421l6.775696-8.047791l5.687134-10.999084l3.880066-8.36438l1.077823-4.519531l1.406491-8.26886v-6.542664l-.697022-7.202392-.709469-3.308226Z"
                                            transform="translate(.000003 0.000002)"
                                            fill="#864d72"
                                            stroke-width="1.822" />
                                        <path
                                            d="M402.340332,693.790161l-12.299866-1.264282-7.483764-1.265564-1.671845-1.114014v-4.123291l1.179962-3.561035l3.299256-2.415039l4.383225-.525787l2.210158-2.445526q1.136994-1.589845,1.136994-1.903382t0-3.826416v-3.192993l.638458-2.439819v-3.896668l-.420227-5.006714-1.355225-5.603637-3.352661-4.533997-5.146209-5.428131-5.496857-7.150543-4.745178-5.40387-3.23172-5.244018-2.888351-7.036011-.531541-4.819916-.086303-6.859955-.491883-6.274048q-.20285-3.551941-.20285-4.465637t.181412-5.639709l1.131165-3.604187-.463608-4.754273-4.483613-4.429565-3.485321-1.574951-4.362167-3.424012-3.095871-2.221862-2.556579-6.289185-1.136078-3.038208q1.157195-6.240477,1.230102-6.240477t3.195069-4.070924l3.500946-3.22229l1.698272-3.658142q1.836243-2.220216,1.836243-3.346162t4.899475-4.480834l3.22313-3.829438l5.227834-3.50061l5.920038-2.216309l6.315796-.819274l3.570343-.27417h1.249481q2.720185-7.710449,2.720185-8.328613t2.915802-7.884583l2.342895-4.864441l4.61734-6.876953l4.576935-5.068802l7.524933-7.700565l7.14881-7.541791l4.043344-3.724151l4.261124-3.073303l3.527618-1.704438h2.140073l.668765-.468869-.234406,3.423887v5.705649l-.513746,5.230813-1.224413,6.092224-2.227173,8.155273-2.581846,6.142716-2.994081,5.211349-3.818055,6.185364-2.873111,3.631897-2.822628,3.802857-3.752991,3.65448-.699677,1.591003.392991,3.479004l1.857498,2.298706.713257,1.208679l6.137457-3.23114l10.441186-2.639465l11.337189-1.012268l15.972382,1.903137l15.196502,3.458222l6.692871,1.268462l6.142121,1.7099-5.130377,5.086395-8.494438,4.013409-11.418825,4.093434-13.151551,1.679199-12.946136,1.029236-7.987457.617431-3.782959.045838v2.378883l.319091,5.715883l1.389801,6.589144l3.725068,3.702931l3.047912,1.713776l5.318947.706634l4.940605-.706634l3.773651-.559418h2.642609q1.820781,0,2.297425,0t3.947509-1.140931q2.319894-.509521,2.880116-.509521t5.715883-.601563q6.906692,0,7.065467,0t8.77756.484009l7.981415,2.017059l9.041888,3.025361l4.990186,1.80957l8.416626,5.412048q6.497803,4.71753,6.588867,4.71753c.091064,0,6.792968,7.115875,6.851379,7.115875q.058411,0,6.160462,9.171722l5.895813,15.962769l1.95697,8.485901.559021,9.210937-.841736,12.015564-1.284668,4.70221q-1.744507,5.380309-1.744507,6.329101t-.498169,5.344483l4.36908,5.53421l2.708862,3.993683q2.190675,5.23935,2.310059,6.092407c.119384.853058.238768,5.516235.119384,5.516235q-.119384,0-3.306701,5.961975l-5.702515,3.548889-10.145141,2.849305h-7.144379l-4.910126-2.754334-3.782058-2.054687-3.230271-1.097901-5.470245,1.442932-3.828217,1.709656-8.079864,1.228272-3.432312,2.388458-2.609381.385956-15.255457-.385956q-9.677887-.862396-11.123291-.862396t-16.897125-1.526062l-6.934815-.488037-8.284485-.076294-4.997589-.663941h-2.450287l-2.435638-1.385254-1.37439-1.993438v-1.762299-1.953003l2.250489-2.511841l2.625732-1.722351l4.224982-2.415039l1.38917-.525787-1.38917-2.445526-2.26789-2.539734-1.242141-2.648987-1.781144-1.674866-2.435638,3.837647-3.62558,5.997253-3.32135,5.976074-3.510453,6.502869-.702346,1.264282Z"
                                            fill="#864d72"
                                            stroke-width="1.822" />
                                    </g>
                                    <g transform="translate(.000001 0.000001)">
                                        <path
                                            d="M882.132568,201.093063l-8.457153,15.281006-15.464111,30.154709-16.561646,32.059708-25.107422,47.561722-64.163818-124.980927h16.927185l47.33728,92.808807l48.242798-91.252212l5.107239-1.983124l12.139648.350311Z"
                                            fill="#8b5795"
                                            stroke-width="1.822" />
                                        <path
                                            d="M758.933167,228.049988h-1.941285q-3.517274.873231-3.517274.878113t-10.270569,6.030455q-6.265442,4.084503-6.265442,5.039871t-3.00232,4.475556l-4.576965,10.964583-.400757,10.663118.440094,4.273894v.633429l.723279,1.57644l1.477188,3.179383l3.046875,4.439514l2.292607,2.757538l5.558955,4.438598l5.846927,3.432099l6.614011,1.370788l7.460937.271881l5.64484.27121l8.912476.050964l5.69273-1.861847l4.615009-1.540008l3.744812-.954804-4.855652-9.852279-2.329651-4.964249-1.174518-1.038788-1.219708-.448181-2.376221-.113251-2.048767.113251-2.5741.341827-3.54626.385437h-2.84015l-3.060364-.385437-3.795678-1.470086-2.851298-1.999687-2.421875-3.164809-.976562-3.175079-.46875-1.731629.46875-3.252045.976562-3.955322l2.421875-3.549241l4.0625-2.765212l3.583927-1.880493l1.181698-1.167954.390625-2.192733-1.09375-2.734058-1.478024-2.970488-1.990417-3.205382-1.805261-3.114547-1.214301-1.053406-.527802-.413773-.532956-.633161Z"
                                            transform="translate(.000002 0.000002)"
                                            fill="#8b5795"
                                            stroke-width="1.822" />
                                        <path
                                            d="M806.863708,117.821175l-2.718566-2.308159-4.300415-3.872299-1.426271-4.839501l1.42627-5.678903l4.261413-4.518569l6.329102-4.060044q5.74182-1.079329,5.74182-.828277t7.185546,1.896621q4.718444,1.856438,4.896911,1.856438c.178467,0,3.145997,3.984963,3.443238,4.256325q.297241.271362,1.733398,4.879112l-1.173706,6.277534-2.171264,3.000885-2.96814,1.630677-.663574.854431-.328797,8.848747-.16864,9.490677-.1604,8.280343v8.241485l.652221,4.649017.949585,1.759888l8.888733.610405l11.09314.257484l14.499512,2.243057q4.623108,2.421166,5.183746,2.577042t6.606842,2.795105l7.122192,3.860947q6.726991,4.467819,6.726991,4.741867t7.140868,9.366516l4.196106,8.992859q1.23291,6.947608,1.23291,7.659866c0,.712258,0,7.488129,0,7.667664s-2.225219,8.067153-2.225219,8.220153q0,.153-3.31073,5.908188l-5.560425,6.144394-7.662994,6.67775-10.647919,5.838074-4.592774,1.342697l4.939759-9.475937l7.863159-13.07663l6.610107-12.117416l3.181031-6.200241l1.463745-4.523041-.028443-1.114746-2.891784-.227509-4.521912.227509-6.174805-3.030274-7.844177-7.998321-10.199859-5.346405-9.879914-2.411331-6.96167-.6017-12.829956-.62674h-3.484741l-.753143,3.639771.409942,18.736313v28.666122l1.536988,1.742447l7.769226.985214l9.34143.598267-2.548706,4.759964-3.991454,8.196335-2.083345,2.187286-5.102142,1.257736-2.79071.62764-1.191589-.242142-.545166-1.243888-1.841004,9.907264l6.643982.427704-13.303101,26.696961-3.060233-5.510712-4.810982-11.349487-.309143-15.061417.309143-6.566284-2.02118-1.478043-2.155395.119248h-3.056946l-3.362974-.573517-3.418459-3.100926-2.264832-4.079845-4.531738-10.108673l20.91864-.167786-.661926-26.689468-.291382-19.857682-3.242248-.499832-9.926514,1.621201-13.550232,4.431366-17.053406,1.912781-14.201144-1.912781-11.107137-4.050629-2.149482-6.394134l2.149482-5.661133l5.757256-3.256752l5.349881-3.479294l11.013009-3.237373l9.696192-1.376038l11.765056,1.00293l6.49001,1.314285l6.899597,2.772354l6.732178-.476158l4.805359-.895637.077819-12.349808-.052978-12.856029-.757749-17.325435Z"
                                            transform="translate(.000003 0.000001)"
                                            fill="#8b5795"
                                            stroke-width="1.822" />
                                        <path
                                            d="M822.951721,329.243561c0,.849579-.106873,15.070587-.155762,15.640808s-.740051,11.650878-.740051,11.884521q0,.233643.52356,2.191894l1.870971-.000001q6.318695-2.660279,6.318695-3.32042t8.961151-5.357286l7.655029-7.529481l12.81842-7.829469l8.487367-4.739564l14.01898-2.90329v1.564665l-9.034668,4.361938-9.187165,6.480681-10.188324,11.18277-10.169311,9.880493q-12.329222,7.748168-12.427856,7.748168t-8.340149,4.106812l-.809053,1.369323q-.626068,7.947053-.626068,8.049683t.128418,4.950592l1.489381,1.197662q1.542052,1.424164,1.556151,1.424164t.840821,2.527954l-.826721,2.178223q-3.079224,4.961109-3.079224,5.026233t-5.859251,17.915356l-8.502626-23.82608-.680665-1.821442l1.292389-2.804352l2.149082-2.748668l1.515194-3.516667q0-4.037655,0-4.363272t-.803894-3.38305l-7.311706-2.608309-20.375183-6.056482-4.889344-3.383305-3.290588-5.965473q-2.603755-5.721813-2.603755-6.485821t-.432256-7.529473l.432256-7.066596l3.224727-7.146851l4.720336-6.315694l5.898438-5.275001q9.159302-4.456362,9.159302-4.741702t5.787598-2.237366q2.678776,4.829995,2.678776,5.090488t4.869808,9.228574q1.105774,1.743529,1.105774,1.99298t0,1.701477l-2.078736.862033q-5.224059,2.597043-5.622253,2.597043t-3.44989,3.031647l-3.310486,5.213929-.659362,6.355498.678771,4.239014l2.739685,3.472961l4.001282,2.598969l3.753723,1.49199l2.841492.627151l1.420291-.077301.7113-1.394318v-4.296691q0-8.665016,0-8.730139t0-9.05157l.60199-5.680572l4.894348,8.22821q6.308838-9.077789,6.308841-8.228198Z"
                                            transform="translate(.000003 0.000012)"
                                            fill="#8b5795"
                                            stroke-width="1.822" />
                                        <path
                                            d="M850.36792,272.312683l4.718354-6.210996l2.575164-6.650454l3.095764-1.82312l2.84906.057648l7.819153,4.478546l7.471923,5.71466l5.958374,7.546418l2.668885,8.791717q.492919,7.790344.492919,8.775665t-2.51007,8.034638q-6.040284,7.818725-6.040284,7.964935t-7.418579,5.592468l-11.053101,4.914795-15.14331,3.243455-11.554198.962753-6.553712.700347-1.964234-1.6631.350648-2.785508l3.586425-5.372742l2.545349-3.998474q1.3176-2.68927,2.035524-2.68927t14.762023-3.790649q3.853577-.10257,4.079773-.10257t8.327636-6.001526q3.653625-6.41452,3.558838-6.41452t.139343-6.67746l-1.666808-6.321852-2.743592-1.907213-10.387267-4.368591Z"
                                            transform="translate(.000001 0)"
                                            fill="#8b5795"
                                            stroke-width="1.822" />
                                    </g>
                                    <g transform="translate(.000001 0)">
                                        <path
                                            d="M604.434509,195.74649l-9.82019-44.075805-28.640625-59.955262-33.872742-40.272164-42.080719-28.080375L438.602875,4.94361l-35.164276-4.943611-58.125672.999999-50.306061,17.11132L249.84903,41.770686L217.640564,69.62654l-27.727997,35.679825-15.054504,29.00975-10.334809,36.76706-4.444992,24.663314-3.02864,26.258973l1.013626,51.618774l6.318405,37.614471l13.545471,49.513123l9.787872,32.668091l10.31575,34.473968l11.584183-11.526641-15.309197-42.82016-8.296546-34.328685-8.082062-41.216085-5.328278-22.450233-1.459335-30.269615.554657-22.125031v-23.357666l7.302368-29.858246l7.01265-26.954314l10.886963-24.92199l15.726867-21.461479L227.45134,77.366466l22.39769-17.244137l32.202423-23.066933l32.353973-14.780683l56.201172-10.890728l43.343597,1.06637l43.627228,10.053356l32.484192,14.551685L517.579102,58.43123l20.10144,18.935236l17.874085,24.917499l15.022521,27.659973l9.007325,24.394135l6.199829,17.597229l5.233154,18.587799l3.596863,6.055069l9.82019-.83168Z"
                                            transform="translate(0 0.000001)"
                                            fill="url(#eiEzgFMJBnY13-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M212.758514,413.061523l-18.452782-90.318465-4.393165-52.367478q5.553436-60.524338,5.553436-60.858551t15.551087-46.03556l26.329285-45.660294l26.60823-26.105751l26.761673-17.154488L330.371979,60.62447l30.865997-6.596939l38.205811,1.685009l51.329345,13.914001L496.000305,99.99617q22.409485,34.609056,24.108887,38.330689t16.116516,41.331802q1.034302,38.993735,1.034302,39.539184t-11.120484,91.388489l35.673218-24.344757l57.762451-32.085541l50.261902-7.137695l32.273682-2.757553l12.951782,3.677811l7.516724-1.810685l4.772949-9.255477l26.122375-17.752953-13.830688-23.372994-53.380188-7.717178-24.352112.599991q-57.477112,8.417618-57.477112,8.183243c0-.234375-6.223327.906097-9.82019.335861q-3.596863-.570236-17.484406-40.630524l-14.094268-34.037162-29.461731-41.447182-27.418976-21.886681-41.593903-22.091461-46.175049-14.551685-45.169433-1.214978-34.64656,4.635771-53.344499,20.906653-44.682067,27.729778-32.509125,37.768272-19.834213,35.31836-8.452271,32.011093-6.195625,31.838531-2.412682,47.459503l4.168045,28.157593l5.898514,24.12442l9.801575,49.513123l8.708343,31.374359l9.264465,23.813233l3.778061-2.8779Z"
                                            fill="url(#eiEzgFMJBnY14-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M851.270508,407.62851q0,.407867.808349,32.368317-1.526733,25.983028-2.032471,26.052489t-7.637328,33.805909q-13.451507,33.72305-13.751343,33.931456t-16.707276,28.265443l-12.105709,16.46399-34.772159,32.669067-1.031189-10.561952l28.693786-25.061095l27.953002-39.91919l15.503907-35.787719l7.938539-30.162691l3.395781-17.493346q3.74411-44.978546,3.744111-44.570678Z"
                                            transform="translate(.000001 0.000001)"
                                            fill="url(#eiEzgFMJBnY15-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M615.323854,647.696289q-.989319,2.140503-1.664856,2.140503t-14.296387.611388l-3.453309,11.368164l26.901733-2.445373-7.487181-11.674682Z"
                                            transform="translate(.000002 0.000002)"
                                            fill="url(#eiEzgFMJBnY16-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M350.373413,667.241369q26.214875-.113317,27.042908-.113317t15.315613-.187073q.580751,3.940466.580751,5.414465t-.580752,2.596558l-2.691468,3.716088-5.480316,1.346372-2.940124,3.154577-.735166,2.917263v5.903196l-18.88486-.418945-16.687073-.932984h-2.930969l-1.361084-1.988403l4.406555-2.62616q4.097077-4.145672,4.376282-4.145672t1.627502-3.209247v-6.312646l-1.057799-5.114072Z"
                                            transform="translate(.000001 0.000004)"
                                            fill="url(#eiEzgFMJBnY17-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M415.935699,670.211523l6.338379,8.456568q-5.69574,2.830469-5.69574,3.66571t-4.059678,3.752503l-.392991,4.551268l4.452668,3.817993-14.364106-.665405l13.721468-23.578637Z"
                                            transform="translate(.000002 0.000001)"
                                            fill="url(#eiEzgFMJBnY18-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M640.181763,672.141393l-6.260742,2.497071-25.984498.313536-10.200927,7.020655q-5.935365,7.63203-5.935365,8.458471t1.010803,9.52041l-108.322906-2.544648l21.509246-6.975764l5.085297,3.359034q4.485017,1.228272,6.49643,1.228272c2.011413,0,4.690062,1.305822,5.489379,1.305822q.799317,0,10.505433-2.534094l7.139465-4.340698l4.286194-7.476807-4.286194-8.143213-.324707-3.61792l16.645691-.552674q0,4.666082,0,4.979618c0,.313536-.02771,4.029624,0,4.029624q.02771,0,3.260653,3.304565l4.148893,1.196386h8.683166l9.577881-4.500951l7.839478-6.526695l2.266601-4.971108l8.153259.177063L613.659,665.49277l8.766384-1.469396l5.641876-.220241l12.114503,8.33826Z"
                                            transform="translate(.000001 0.000003)"
                                            fill="url(#eiEzgFMJBnY19-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M49.726162,734.523315l49.48228-21.003538l30.694501-8.155458l28.160305-7.762415l38.729141-5.612403-59.721101-.254028-29.848599,11.79956c-15.952677,6.042701-44.125824,21.745975-57.496527,30.988282Z"
                                            transform="translate(.000003 0.000001)"
                                            fill="url(#eiEzgFMJBnY20-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M572.851807,652.524232l-36.408203.341003-2.364259,9.390929l26.215669,1.767212l12.315703-4.993835.24109-6.505309Z"
                                            transform="translate(.000001 0.000001)"
                                            fill="url(#eiEzgFMJBnY21-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M127.105546,691.257568L71.311333,713.519775q12.715818-9.984743,12.715818-11.548219t30.702995-13.322388l12.3754,2.6084Z"
                                            transform="translate(.000002 0.000002)"
                                            fill="url(#eiEzgFMJBnY22-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M764.041384,621.362915l-1.047549,42.606201l2.078738,4.183715h8.022886l51.212463-37.269104l32.87268-39.058624l24.154511-39.213007l19.950225-52.756871l5.895081-35.764467l2.458618-45.525146-1.176025-28.967377-16.456238-54.368439-7.151062,1.184082-31.120728,26.320496-.703796,9.872437l8.203003,37.874481q-2.098999,51.650908-2.098999,53.609466t-10.359985,45.316088l-13.267396,31.462782-23.557371,37.646486-22.790956,24.161802-25.1181,18.684999Z"
                                            transform="translate(.000001 0.000001)"
                                            fill="url(#eiEzgFMJBnY23-fill)"
                                            stroke-width="1.822" />
                                        <path
                                            d="M392.83905,661.476685q-.383957,0-45.717207-.575745l-13.395555-9.29651q46.423401-1.156251,47.158569-1.156251t8.495117-.662413l3.932709,7.510496q-.089678,4.18042-.473633,4.180423Z"
                                            transform="translate(.000002 0.000003)"
                                            fill="url(#eiEzgFMJBnY24-fill)"
                                            stroke-width="1.822" />
                                    </g>
                                </svg>
                            <input class="gwendolyn-bold" style="font-style: italic;font-size: 4ex;height: 25px;border: 0;" placeholder="${prontuario.veterinario.nome}" >
                        </div>

                        <div class="id" style="width: 21%;text-align: left;">
                            <h2 >Prontuário Veterinário</h2>
                            <h2>ID:<input style="background-color: #8b5795;width: 80%;margin-left: 2mm;height: 30px;font-size: 2ex;border: 0;" value="${prontuario.id}"></h2>
                            
                        </div>      

                    </header>

                    <main>
                        <div class="conteiner2">
                            <div> 
                                <strong><h2 class="titulos">Informações do Proprietario</h2></strong>
                            </div>  

                            <div class="subtitulos"> 
                                <label >Nome: </label>
                                <input type="text" maxlength="50" value="${prontuario.tutor.nome}" placeholder="Digite seu nome completo">
                            </div>

                            <div class="subtitulos"> 
                                <label >Email: </label>
                                <input type="text" maxlength="50" value="${prontuario.tutor.email}" placeholder="ex: josefa.cringe@gmail.com">
                            </div>
                            
                            <div class="subtitulos">
                                <label for="telefone">Telefone: </label>
                                <input type="text" id="telefone" maxlength="15" value="${prontuario.tutor.telefone || ''}" placeholder="(00) 00000-0000">
                            </div>
                            <script>
                                document.getElementById('telefone').addEventListener('input', function (e) {
                                    let telefone = e.target.value.replace(/\D/g, ''); 
                                    telefone = telefone.replace(/(\d{1})(\d)/, '($1$2) '); 
                                    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2'); 
                                    e.target.value = telefone;
                                });
                            </script>

                            <div class="subtitulos"> 
                                <label for="cpf">CPF:</label>
                                <input type="text" id="cpf" maxlength="14" value="${prontuario.tutor.cpf || ''}" placeholder="000.000.000-00">
                            </div>
                            <script>
                                document.getElementById('cpf').addEventListener('input', function (e) {
                                    let cpf = e.target.value.replace(/\D/g, ''); 
                                    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
                                    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
                                    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
                                    e.target.value = cpf;
                                });
                            </script>

                            <div class="subtitulos">  
                                <label >Endereço:</label>
                                <input type="text" value="${prontuario.tutor.endereco || ''}" placeholder="rua das flores,58">
                            </div>

                            <div class="subtitulos"> 
                                <label >Data de cadastro:</label>
                                <input type="date" value="${new Date(prontuario.tutor.data_cadastro).toISOString().split('T')[0]}">
                            </div>

                            <div class="subtitulos"> 
                                <label >Data de nascimento:</label>
                                <input type="date" value="${new Date(prontuario.tutor.data_nascimento).toISOString().split('T')[0]}">
                            </div>
                                                                
                        </div>

                        <div class="conteiner2">
                            <div>
                                <h2 class="titulos">Informações do Animal</h2>
                            </div>

                            <div style="display: flex; justify-content: space-between;">
                                <div class="subtitulos" style="width: 50%;"> 
                                    <label ></label>Nome: </label>
                                    <input type="text" style="width: 80%;" value="${prontuario.animal.nome}" maxlength="100" placeholder="ex: Spike,Bob,Bartolomeu.....">
                                </div>

                                <div class="subtitulos" style="width: 50%;">
                                    <label >Espécie: </label>
                                    <input type="text" maxlength="20" value="${prontuario.animal.especie || ''}" placeholder="ex: preto">
                                </div>
                                
                            </div>
                            
                            <div style="display: flex; justify-content: space-between;">
                                <div class="radio" style="width: 50%;"> 
                                    <label >Sexo: </label>
                                    <input type="radio" name="Sexo" value="${prontuario.animal.sexo === 'Macho' ? 'checked' : ''}"><a>Macho</a>   <input type="radio" name="Sexo" value="${prontuario.animal.sexo === 'Fêmea' ? 'checked' : ''}">Fêmea
                                </div>

                                <div class="subtitulos" style="width: 50%;">
                                    <label >Raça: </label>
                                    <input type="text" maxlength="20" value="${prontuario.animal.raca || ''}" placeholder="ex: preto">

                                </div>
                            </div> 

                            <div style="display: flex; justify-content: space-between;">

                                <div style="width: 30%;" class="subtitulos">
                                    <label >Cor:</label>
                                    <input type="text" maxlength="15" value="${prontuario.animal.raca || ''}" placeholder="ex: preto">

                                </div>

                                <div style="width: 30%;" class="subtitulos">
                                    <label >Peso: </label>
                                    <input type="number" maxlength="20" value="${prontuario.animal.peso || ''}" placeholder="kg">

                                </div>

                                <div style="width: 30%;" class="subtitulos">   
                                    <label >Idade: </label>
                                    <input type="number" step="0.1" style="width: 40%;" value="${prontuario.animal.idade || ''}" placeholder="Ex: 1.5 anos">
                                </div>

                                
                            </div>

                            <div class="subtitulos"> 
                                <label >Data de cadastro:</label>
                                <input type="date" value="${new Date(prontuario.animal.data_cadastro).toISOString().split('T')[0]}">
                            </div>

                            <div class="subtitulos"> 
                                <label >Data de nascimento:</label>
                                <input type="date" value="${new Date(prontuario.animal.data_nascimento).toISOString().split('T')[0]}">
                            </div>
                        </div>
                            
                </main>
            
            </body>
            </html>


            `;

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 60000,
        });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        return { pdfBuffer, nome };
    }
}
