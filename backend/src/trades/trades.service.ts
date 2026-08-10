import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTradeDto, UpdateTradeDto } from './dto/trades.dto';
import { PrismaService } from '../prisma.service';
import { TradeStatistics } from './types';

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
    async update(userId: string, tradeId: string, dto: UpdateTradeDto) {
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
            where: { id: tradeId },
            data: dto
        })
    }
    async getStatistic(userId: string): Promise<TradeStatistics> {
        const trades = await this.prisma.trade.findMany({
            where: {
                userId,
                closedPrice: { not: null },
                pnl: { not: null }
            }
        });
        if (trades.length === 0) {
            return {
                totalTrades: 0,
                winsCount: 0,
                lossesCount: 0,
                winrate: 0,
                totalPnl: 0,
                averagePnl: 0,
                averageWin: 0,
                averageLoss: 0,
                bestTrade: 0,
                worstTrade: 0,
                profitFactor: 0,
                expectancy: 0,
                averageDuration: 0,
            };
        }
        const wins = trades.filter(t => t.pnl! > 0);
        const losses = trades.filter(t => t.pnl! < 0);

        const totalPnl = trades.reduce((sum, t) => sum + t.pnl!, 0);
        const totalWins = wins.reduce((sum, t) => sum + t.pnl!, 0);
        const totalLosses = losses.reduce((sum, t) => sum + Math.abs(t.pnl!), 0);
        const totalDurationMs = trades.reduce((sum, t) => {
            const duration = t.dateClose!.getTime() - t.dateOpen.getTime();
            return sum + duration;
        }, 0);
        const averagePnl = totalPnl / trades.length
        const winrate = (wins.length / trades.length) * 100
        const averageDuration = totalDurationMs / trades.length / 1000 / 60
        const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0
        const bestTrade = Math.max(...trades.map(t => t.pnl!))
        const worstTrade = Math.min(...trades.map(t => t.pnl!))
        const averageWin = wins.length > 0 ? totalWins / wins.length : 0
        const lossRate = losses.length / trades.length;
        const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0
        const expectancy = ((winrate / 100) * averageWin) - (lossRate * averageLoss);
        return {
            averagePnl: averagePnl,
            winrate: winrate,
            averageDuration: averageDuration,
            profitFactor: profitFactor,
            totalPnl: totalPnl,
            totalTrades: trades.length,
            winsCount: wins.length,
            lossesCount: losses.length,
            bestTrade: bestTrade,
            worstTrade: worstTrade,
            averageWin: averageWin,
            averageLoss: averageLoss,
            expectancy: expectancy
        }
    }
}