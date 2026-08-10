import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TradesService } from './trades.service';
import { CreateTradeDto, UpdateTradeDto } from './dto/trades.dto';
import { CurrentUser, SafeUser } from '../common/decorators/current-user.decorator';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {
    constructor(private readonly TradesService: TradesService) { }

    @Post("")
    create(@Body() dto: CreateTradeDto, @CurrentUser() user: SafeUser) {
        return this.TradesService.create(user.id, dto)
    }
    @Get("")
    getAll(@CurrentUser() user: SafeUser) {
        return this.TradesService.getAll(user.id)
    }
    @Get("/trade")
    findById(@CurrentUser() user: SafeUser, @Param("tradeId") tradeId: string) {
        return this.TradesService.findById(user.id, tradeId)
    }
    @Delete("/trade/:tradeId")
    deleteById(@CurrentUser() user: SafeUser, @Param("tradeId") tradeId: string) {
        return this.TradesService.deleteById(user.id, tradeId)
    }
    @Patch("/trade/:tradeId")
    update(@CurrentUser() user: SafeUser, @Param("tradeId") tradeId: string, @Body() dto:UpdateTradeDto) {
        return this.TradesService.update(user.id, tradeId, dto)
    }
    @Get('/statistic')
    getStatistic(@CurrentUser() user: SafeUser){
        return this.TradesService.getStatistic(user.id,)
    }
}
