import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.refreshSecret') || 'fallback-refresh-secret',
            passReqToCallback: true as const,
        });
    }

    async validate(req: Request, payload: { sub: string; email: string }) {
        const refreshToken = req.get('Authorization')?.replace('Bearer ', '');

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        return {
            id: payload.sub,
            email: payload.email,
            refreshToken,
        };
    }
}
