import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
    ) { }
    async create(email: string, passwordHash: string) {
        return this.prisma.user.create({
            data: {
                email, passwordHash
            }
        })
    }
    async findByEmail(email: string){
        return await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }
    getAll() {
        return
    }
}
