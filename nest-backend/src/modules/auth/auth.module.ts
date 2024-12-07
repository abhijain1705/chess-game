// nestjs import
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controller
import { AuthController } from './auth.controller';

// services
import { AuthService } from './auth.service';

// entity
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
