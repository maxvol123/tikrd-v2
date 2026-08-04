import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }
    @UseGuards(AuthGuard("jwt"))
    @Get("/me")
    me(@Req() req: Request) {
       return req.user
    }
}
