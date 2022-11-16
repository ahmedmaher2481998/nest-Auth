import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { getCurrentUser, getCurrentUserId, isPublic } from './decorators';
import { authDto } from './dto';
import { RtGuard } from './guards';
import { token } from './types';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @isPublic()
  // local/signUp
  @Post('/local/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: authDto): Promise<token> {
    return this.authService.signUp(dto);
  }

  @isPublic()
  // local/signIn
  @Post('/local/sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  signIn(@Body() dto: authDto): Promise<token> {
    console.log('I get This');
    return this.authService.signIn(dto);
  }
  // local/logout
  @Post('/log-out')
  @HttpCode(HttpStatus.OK)
  logout(@getCurrentUserId() id: number) {
    this.authService.logOut(id);
  }
  // local/refresh
  @isPublic()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @getCurrentUserId() id: number,
    @getCurrentUser('refreshToken') refreshToken: string,
  ): Promise<token> {
    return this.authService.refresh(id, refreshToken);
  }
}
