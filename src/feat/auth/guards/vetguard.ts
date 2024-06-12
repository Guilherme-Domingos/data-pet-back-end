import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from '@nestjs/core';

@Injectable()
export class VetAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const canActivate = await super.canActivate(context);
        if (!canActivate) {
            return false;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.role !== 'VETERINARIO') {
            throw new UnauthorizedException('Access restricted to veterinarians only');
        }

        return true;
    }
}
