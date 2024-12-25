// nest imports
import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  //   signup
  //   login
  //   forgot password
  // reset password

  constructor(private authService: AuthService) {}

  @Post()
  login() {}

  @Post()
  forgotPassword() {}

  @Post()
  resetPassword() {}

  @Post()
  signup() {}
}
