import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/trades.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TradesService {
    constructor(private readonly prisma: PrismaService) { }
    async create(userId: string, dto: CreateTradeDto) {
        return await this.prisma.trade.create({
            data: {
                userId,
                ...dto
            }
        })
    }
    async getAll(userId: string){
        return this.prisma.trade.findMany({where: {userId}})
    }
}
