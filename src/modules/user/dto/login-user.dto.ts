// create-user.dto.ts
export class CreateUserDto {
  nickname: string;
  password: string;
  gender?: number;
  avatar?: string;
  phone?: string;
}

// login-user.dto.ts
export class LoginUserDto {
  nickname: string;
  password: string;
  captcha: string;
}
