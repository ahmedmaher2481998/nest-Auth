import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtJTW, RtJTW } from './strategy';
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtJTW, RtJTW],
})
export class AuthModule {}
