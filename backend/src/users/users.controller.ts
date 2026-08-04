import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }

    @Get("/me")
    @UseGuards(AuthGuard("jwt"))
    me(@CurrentUser() user) {
        return user
    }
}
