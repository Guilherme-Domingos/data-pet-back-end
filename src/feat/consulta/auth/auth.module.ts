import { Module } from "@nestjs/common";
import { createUser } from "./clientes/create/controller/cliente.controller";
import { PrismaService } from "src/prisma/service";
import { userServices } from "./clientes/create/services/user.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from "./guards/jwtguard";
import { JwtStrategy } from "./strategies/jwtauth";
import { authClient } from "./clientes/auth/controller/cliente.controller";
import { AuthService } from "./services/auth.service";
import { LocalAuthGuard } from "./guards/localauth";
import { LocalStrategy } from "./strategies/localauth";

@Module({
    imports: [PassportModule, JwtModule.registerAsync({
        useFactory: async () => ({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '8h' },
        }),
      })
    ],
    controllers: [createUser, authClient],
    providers: [PrismaService, userServices, JwtAuthGuard, JwtStrategy, AuthService, LocalAuthGuard, LocalStrategy],
})
export class AuthModule {}