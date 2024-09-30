import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MoneyModule } from './modules/money/money.module';
import { PiggyBankModule } from './modules/piggy-bank/piggy-bank.module';
import { UserModule } from './modules/user/user.module';
import configuration from './config/index';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          entities: ['dist/**/*.entity{.ts,.js}'],
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    MoneyModule,
    PiggyBankModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
