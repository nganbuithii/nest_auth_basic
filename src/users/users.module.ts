import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role, RoleSchema } from '@/roles/schemas/role.schema';
import { JwtModule } from '@nestjs/jwt';
import ms from 'ms';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
            expiresIn:ms(configService.get<string>('JWT_EXPIRED_IN'))/1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [UsersService]
})
export class UsersModule { }
