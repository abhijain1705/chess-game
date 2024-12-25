// nest imports
import { Get, Injectable, Post } from '@nestjs/common';

@Injectable()
export class UsersService {
  // create user
  // get user from name
  // get user from email
  // get all user
  // find user

  constructor(private userService: UsersService) {}

  @Post()
  createUser() {}

  @Get()
  getUserFromName() {}

  @Get()
  getUserFromEmail() {}

  @Post()
  getAllUser() {}

  @Post()
  findUser() {}
}
