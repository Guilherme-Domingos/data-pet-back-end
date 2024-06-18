import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { prontuarioDTO } from '../DTO/prontuarioDTO';
import { ApiTags } from '@nestjs/swagger';
import { crudService } from '../services/crud.service';

@Controller('/prontuario')
export class CreateProntuarioController {
  private readonly logger = new Logger(CreateProntuarioController.name);
  constructor(private service:crudService) {}
 
  @Post('/createProntuario') 
  @ApiTags('Prontuario')
  async createProntuario(@Body() body: prontuarioDTO) {
    try{

      return this.service.createProntuario(body);
    }catch(error){
      this.logger.error(error);
      throw new HttpException(
        {
          message: 'Failed to create prontuario',
          error: error,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
