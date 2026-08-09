import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTradeDto, UpdateTradeDto } from './dto/trades.dto';
import { PrismaService } from '../prisma.service';
import { TradeStatistics  } from './types';

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
    async deleteById(userId: string, tradeId: string) {
        if (!userId || !tradeId) {
            throw new BadRequestException('userId and tradeId are required')
        }
        console.log({ userId, tradeId })
        const { count } = await this.prisma.trade.deleteMany({
            where: { id: tradeId, userId }
        })
        if (!count) {
            throw new NotFoundException("Trade not found")
        }
    }
    async update (userId: string, tradeId: string, dto: UpdateTradeDto){
        const trade = await this.prisma.trade.findFirst({
            where: {
                userId: userId,
                id: tradeId
            }
        })
        if (!trade) {
            throw new NotFoundException("Trade not found")
        }
        return this.prisma.trade.update({
            where: {id: tradeId},
            data: dto
        })
    }
    async getStatistic(userId: string){
        const trades = await this.getAll(userId)
        let statistic: TradeStatistics

        
    }
}