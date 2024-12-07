// nestjs import
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// entity
import { User } from '../../entities/user.entity';

// typeorm
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
}
