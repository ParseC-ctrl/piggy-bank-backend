import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册接口
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.userService.registerUser(createUserDto);
  }

  // 登录接口
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Body('captchaText') captchaText: string,
  ): Promise<string> {
    return this.userService.loginUser(loginUserDto, captchaText);
  }

  // 生成验证码接口
  @Get('captcha')
  generateCaptcha() {
    return this.userService.generateCaptcha();
  }
}
