import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { Public } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, type: LoginResponseDto })
    async login(@Body() loginDto: LoginDto, @Request() req): Promise<LoginResponseDto> {
        return this.authService.login(
            loginDto,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent'),
        );
    }
}
