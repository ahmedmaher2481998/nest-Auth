import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { authDto } from './dto';
import * as bcrypt from 'bcrypt';
import { token } from './types';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async signUp(dto: authDto): Promise<token> {
    const newUser = await this.prisma.user.create({
      data: { email: dto.email, hash: this.hashData(dto.password) },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }
  async signIn(dto: authDto): Promise<token> {
    const user = this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const isPassMatch = bcrypt.compareSync(dto.password, (await user).hash);
    if (!isPassMatch) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens((await user).id, (await user).email);
    await this.updateRtHash((await user).id, tokens.refresh_token);
    return tokens;
  }
  async logOut(id: number) {
    await this.prisma.user.updateMany({
      where: {
        id,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
  }
  async refresh(id: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const isRtMatch = bcrypt.compareSync(refreshToken, (await user).hashedRT);
    if (!isRtMatch) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens((await user).id, (await user).email);
    await this.updateRtHash((await user).id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(id: number, email: string): Promise<token> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          expiresIn: 15 * 60,
          secret: 'at-secret',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: 'rt-secret',
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(id: number, token: string) {
    await this.prisma.user.update({
      where: { id },
      data: { hashedRT: this.hashData(token) },
    });
  }
  hashData(data: string) {
    return bcrypt.hashSync(data, 14);
  }
}
