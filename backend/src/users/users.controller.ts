import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService:UsersService){}
    @Get("")
    getAll(){
        return this.UsersService.getAll()
    }

    @Post("")
    create(){
        return this.UsersService.create()
    }
}
