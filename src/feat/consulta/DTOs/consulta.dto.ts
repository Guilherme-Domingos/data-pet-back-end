import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateConsultaDto {
    @ApiProperty()
    @IsDate()
    data_consulta: Date;
  
    @ApiProperty()
    @IsNumber()
    peso: number;
  
    @ApiProperty()
    @IsNumber()
    temperatura: number;
  
    @ApiProperty()
    @IsString()
    pressao: string;
  
    @ApiProperty()
    @IsString()
    diagnostico: string;
  
    @ApiProperty()
    @IsNumber()
    veterinarioId: number;
  
    @ApiProperty()
    @IsNumber()
    prontuarioId: number;
  
    @ApiProperty()
    @IsNumber()
    animalId: number;
  }