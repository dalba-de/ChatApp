import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  
  constructor(private readonly jwtService: JwtService) {}

  async login(user: string) {
    const payload = {username: user};
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

}
