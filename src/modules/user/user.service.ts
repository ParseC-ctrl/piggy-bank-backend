import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';

@Injectable()
export class UserService {
  private readonly tokenBlacklist = new Set<string>();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

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
  async loginUser(loginUserDto: LoginUserDto, session: any): Promise<string> {
    const { nickname, password, captcha } = loginUserDto;

    // 验证验证码
    const sessionCaptcha = session.captcha;
    if (captcha.toLowerCase() !== sessionCaptcha?.text.toLowerCase()) {
      throw new BadRequestException('验证码无效');
    }
    const isCaptchaExpired = Date.now() - sessionCaptcha?.createdAt > 60000;
    if (isCaptchaExpired) {
      throw new BadRequestException('验证码已过期');
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

  async getInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      select: ['userId', 'gender', 'avatar', 'phone', 'nickname'],
    });
    return user;
  }

  async logout(userId: string, token: string): Promise<void> {
    // 将令牌添加到黑名单
    this.tokenBlacklist.add(token);
    console.log(
      `User with ID ${userId} has logged out. Token added to blacklist.`,
    );
  }

  isTokenBlacklisted(token: string): boolean {
    console.log(this.tokenBlacklist);
    return this.tokenBlacklist.has(token);
  }
}
