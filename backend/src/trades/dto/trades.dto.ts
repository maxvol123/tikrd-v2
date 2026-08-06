import { IsOptional, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
import { TradeSide } from '../../generated/prisma/enums';


export class CreateTradeDto {
    @IsString()
    symbol!: string;
    
    @IsEnum(TradeSide)
    direction!: TradeSide;
    
    @IsNumber()
    entryPrice!: number;
    
    @IsNumber()
    quantity!: number;
    
    @IsDateString()
    dateOpen!: string;
    
    @IsOptional()
    @IsNumber()
    closedPrice?: number;
    
    @IsOptional()
    @IsNumber()
    riskReward?: number;
    
    @IsOptional()
    @IsNumber()
    pnl?: number;
    
    @IsOptional()
    @IsDateString()
    dateClose?: string;
    
    @IsOptional()
    @IsString()
    notes?: string;
}