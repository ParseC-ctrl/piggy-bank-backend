import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as svgCaptcha from 'svg-captcha';
import * as md5 from 'md5';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 生成验证码
  generateCaptcha() {
    const captcha = svgCaptcha.create();
    return {
      info: {
        data: captcha.data,
        text: captcha.text,
      },
      message: '生成验证码成功',
    };
  }

  // 用户注册
  async registerUser(createUserDto: CreateUserDto): Promise<string> {
    const { nickname, password, ...otherDetails } = createUserDto;

    // 检查昵称是否已存在
    const existingUser = await this.userRepository.findOneBy({ nickname });
    if (existingUser) {
      throw new BadRequestException('昵称已存在');
    }

    // 使用MD5加密密码
    const hashedPassword = md5(password);

    // 创建新用户
    const newUser = this.userRepository.create({
      nickname,
      password: hashedPassword,
      ...otherDetails,
    });

    await this.userRepository.save(newUser);

    // 生成JWT令牌
    const payload = { userId: newUser.userId, nickname: newUser.nickname };
    const token = this.jwtService.sign(payload);

    return token;
  }

  // 用户登录
  async loginUser(
    loginUserDto: LoginUserDto,
    captchaText: string,
  ): Promise<string> {
    const { nickname, password, captcha } = loginUserDto;

    // 验证验证码
    if (captcha !== captchaText) {
      throw new BadRequestException('验证码无效');
    }

    // 检查用户是否存在
    const user = await this.userRepository.findOneBy({ nickname });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 验证密码
    const hashedPassword = md5(password);
    if (user.password !== hashedPassword) {
      throw new BadRequestException('密码错误');
    }

    // 生成JWT令牌
    const payload = { userId: user.userId, nickname: user.nickname };
    const token = this.jwtService.sign(payload);

    return token;
  }

  // 通过昵称查找用户
  async findOneByNickname(nickname: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ nickname });
  }
}
