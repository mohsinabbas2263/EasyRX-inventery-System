import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}

export class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        userId: string;
        email: string;
        role: string;
        branchId: string;
        companyId: string;
    };
}
