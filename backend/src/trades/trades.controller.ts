import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TradesService } from './trades.service';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {
    constructor(private readonly TradesService: TradesService){}

    @Post()
    create()

}
