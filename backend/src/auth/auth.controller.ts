import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../users/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService:AuthService){}
    @Post("/register")
    register(@Body() dto: UserDto) {
        return this.AuthService.register(dto)
    }
}
