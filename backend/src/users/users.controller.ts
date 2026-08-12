import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, SafeUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {

    @Get("/me")
    @UseGuards(AuthGuard("jwt"))
    me(@CurrentUser() user: SafeUser) {
        return user
    }
}
