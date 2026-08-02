import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }
    @Get("")
    getAll() {
        return this.UsersService.getAll()
    }
}
