import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/prisma/service";

@Injectable()
export class userServices{
    constructor(private prisma:PrismaService){}

    async setRole(userId: number){
        try{
            return await this.prisma.roles.create({
                data: {
                    idCliente: userId,
                    role: Role.CLIENTE,
                },
            })
        }catch(e){
            console.log(e)
        }
    }

    async createUser(data: any){
        try{
            const response = await this.prisma.cliente.create({
                data: data
            })
            if(response){
                this.setRole(response.id)
                return response
            }

        }catch(e){
            console.log(e)
        }
    }
}