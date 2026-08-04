import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../generated/prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly UsersService: UsersService,
        private readonly jwtService: JwtService
    ) { }
    async register(dto: RegisterDto) {
        const exist = await this.UsersService.findByEmail(dto.email)
        if (exist) { throw new ConflictException("Email is already used"); }

        const passwordHash = await bcrypt.hash(dto.password, 10)

        const user = await this.UsersService.create(dto.email, passwordHash, dto.username)
        const token = this.generateToken(user)
        const { passwordHash: _, ...rest } = user

        return { user: rest, token }
    }
    async login(dto: LoginDto) {
        const user = await this.UsersService.findByEmail(dto.email)
        if (!user) { throw new UnauthorizedException('Invalid credentials'); }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
        if (!isPasswordValid) { throw new UnauthorizedException('Invalid credentials'); }
        const token = this.generateToken(user)
        const { passwordHash: _, ...rest } = user
        return { user: rest, token }
    }
    generateToken(user: User) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email
        })
    }
}