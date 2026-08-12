import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../generated/prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma.service';
import { SafeUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }
    async register(dto: RegisterDto) {
        const exist = await this.usersService.findByEmail(dto.email)
        if (exist) { throw new ConflictException("Email is already used"); }

        const passwordHash = await bcrypt.hash(dto.password, 10)

        const user = await this.usersService.create(dto.email, passwordHash, dto.username)
        const tokens = await this.generateTokens(user)
        const { passwordHash: _, ...rest } = user

        return { user: rest, ...tokens }
    }
    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email)
        if (!user) { throw new UnauthorizedException('Invalid credentials'); }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
        if (!isPasswordValid) { throw new UnauthorizedException('Invalid credentials'); }
        const tokens = await this.generateTokens(user)
        const { passwordHash: _, ...rest } = user
        return { user: rest, ...tokens }
    }
    async generateRefreshToken(userId: string) {
        const token = randomBytes(64).toString('hex');
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)
        await this.prisma.refreshToken.create({
            data: { token, userId, expiresAt }
        });
        return token
    }
    async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email
        })
        const refreshToken = await this.generateRefreshToken(user.id);
        return { accessToken, refreshToken };
    }
    async refresh(token: string) {
        const record = await this.prisma.refreshToken.findUnique({
            where: { token },
        });
        if (!record) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        if (record.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: record.id } })
            throw new UnauthorizedException('Invalid refresh token');
        }
        const user = await this.usersService.findById(record.userId);
        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        return this.generateTokens(user);
    }
    async logout(token: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({ where: { token } });
    }
}