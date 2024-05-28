import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/service";

@Injectable()
export class userServices{
    constructor(private prisma:PrismaService){}

    async createUser(data: any){
        try{
            return this.prisma.cliente.create({
                data: data
            })
        }catch(e){
            console.log(e)
        }
    }
}