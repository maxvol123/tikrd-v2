import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
    ) { }
    async create(email: string, passwordHash: string, username: string) {
        return this.prisma.user.create({
            data: {
                username, email, passwordHash
            }
        })
    }
    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }
    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
}
