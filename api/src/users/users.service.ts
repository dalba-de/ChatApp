import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStatusDto } from "./dto/update-status.dto";
import { UpdateMutesDto } from "./dto/update-mutes.dto";
import { UpdateMutesToMeDto } from "./dto/update-mutes-to-me.dto";
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

  async findByName(name) {
    return await this.usersRepository.findOne({where: {name: name}});
  }

  async findBySocket(socket) {
      return await this.usersRepository.findOne({where: {socket: socket}});
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

  async updateStatus(updateStatusDto: UpdateStatusDto) {
      return await this.usersRepository.update(updateStatusDto.id, updateStatusDto);
  }

  async updateMutes(updateMutesDto: UpdateMutesDto) {
    return await this.usersRepository.update(updateMutesDto.id, updateMutesDto);
  }

  async updateMutesToMe(updateMutesToMeDto: UpdateMutesToMeDto) {
    return await this.usersRepository.update(updateMutesToMeDto.id, updateMutesToMeDto);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
