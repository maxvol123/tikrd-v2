import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../generated/prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly UsersService: UsersService,
        private readonly jwtService: JwtService
    ){}
    async register(dto: UserDto){
        const exist = await this.UsersService.findByEmail(dto.email)
        if (exist) {throw new ConflictException("Email is already used"); }

        const passwordHash = await bcrypt.hash(dto.password, 10)

        const user = await this.UsersService.create(dto.email, passwordHash)
        const token = this.generateToken(user)
        const {passwordHash: _, ...rest} = user

        return {user: rest, token}
    }
    generateToken(user:User){
        return this.jwtService.sign({
            sub: user.id,
            email: user.email
        })
    }
}
