import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {

  constructor (@InjectRepository(User) private usersRepository : Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  update(id: number, updateUserDto : UpdateUserDto) {
    return 'This action update users';
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(updateUserDto.id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
