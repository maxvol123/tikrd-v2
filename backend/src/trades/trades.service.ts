import { Injectable, NotFoundException } from '@nestjs/common';
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
    async getAll(userId: string) {
        const trades = this.prisma.trade.findMany({ where: { userId } })
        if (!trades) {
            throw new NotFoundException("Trades not found")
        }
        return trades
    }
    async findById(userId: string, tradeId: string) {
        const trade = await this.prisma.trade.findFirst({
            where: {
                userId: userId,
                id: tradeId
            }
        })
        if (!trade) {
            throw new NotFoundException("Trade not found")
        }
        return trade
    }
}
