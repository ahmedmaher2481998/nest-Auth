import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [
    JwtService,
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
