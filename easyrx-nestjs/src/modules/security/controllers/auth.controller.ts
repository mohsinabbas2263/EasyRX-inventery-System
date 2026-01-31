import { Controller, Post, Body, Request, UseGuards, Throttle } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { Public } from '../guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async login(@Body() loginDto: LoginDto, @Request() req): Promise<LoginResponseDto> {
        return this.authService.login(
            loginDto,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent'),
        );
    }
}
