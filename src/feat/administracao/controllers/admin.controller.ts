import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminAuthGuard } from "src/feat/auth/guards/adminguard";
import { AdminDTO } from "../DTOs/adminDTO";
import { AdminService } from "../services/admin.service";

@Controller('/admin')
export class AdminController {
    constructor(private readonly service: AdminService) {}

    @Post('/createAdmin')
    @ApiTags('Admin')
    async createAdmin(@Body() createAdminDto: AdminDTO) {
        const data = createAdminDto;

        try {
            return await this.service.createAdmin(data);
        } catch (error) {
            throw new HttpException('Erro ao criar admin', HttpStatus.BAD_REQUEST);
        }
    }
    @Get('/listAllAdmins')
    @ApiTags('Admin')
    @UseGuards(AdminAuthGuard)
    @ApiBearerAuth()
    async listAll() {
        return this.service.findAdmins();
    }
}