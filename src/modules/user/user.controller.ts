import {
  Controller,
  Post,
  Body,
  Get,
  Session,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as svgCaptcha from 'svg-captcha';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册接口
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const token = await this.userService.registerUser(createUserDto);
    return {
      info: {
        token,
      },
    };
  }

  // 登录接口
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Session() session: any) {
    const token = await this.userService.loginUser(loginUserDto, session);
    return {
      info: {
        token,
      },
    };
  }

  // 生成验证码接口
  @Get('captcha')
  generateCaptcha(@Res() res, @Req() req) {
    const captchaOptions = {
      size: 4, // 验证码字符数量
      ignoreChars: '0o1iTtLl', // 排除容易混淆的字符
      noise: 3, // 干扰线条的数量
      color: true, // 是否使用彩色文字
      background: '#ebedee', // 背景颜色
      width: 150, // 验证码图片宽度
      height: 40, // 验证码图片高度
      fontSize: 50, // 验证码文字大小
    };

    const captcha = svgCaptcha.create(captchaOptions);
    // 将验证码文本存储在会话或数据库中，以便后续验证
    req.session.captcha = {
      text: captcha.text,
      createdAt: Date.now(), // 记录生成时间
    };
    res.set('Content-Type', 'image/svg+xml');
    res.send(captcha.data);
  }

  @Get('getInfo')
  @UseGuards(AuthGuard('jwt'))
  getInfo(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getInfo(userId);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req, @Session() session) {
    const userId = req.user.userId;
    const token = req.headers.authorization.split(' ')[1];
    await this.userService.logout(userId, token);
    // 销毁会话
    session.destroy((err) => {
      if (err) {
        throw new BadRequestException('退出登录失败');
      }
    });
    return {
      info: '成功退出登录',
    };
  }
}
