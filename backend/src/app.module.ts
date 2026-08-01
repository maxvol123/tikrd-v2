import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, PrismaService],
})
export class AppModule {}
