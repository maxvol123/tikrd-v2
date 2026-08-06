import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/trades.dto';
import { CurrentUser, SafeUser } from '../common/decorators/current-user.decorator';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {
    constructor(private readonly TradesService: TradesService){}

    @Post("")
    create(@Body() dto: CreateTradeDto, @CurrentUser() user: SafeUser){
        return this.TradesService.create(user.id, dto)
    }
    @Get("")
    getAll(@CurrentUser() user: SafeUser){
        return this.TradesService.getAll(user.id)
    }
    @Get("/trade")
    findById(@CurrentUser() user: SafeUser, @Param("tradeId") tradeId: string){
        return this.TradesService.findById(user.id, tradeId)
    }

}
