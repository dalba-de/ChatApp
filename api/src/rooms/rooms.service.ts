import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Room } from "./entities/room.entity";

@Injectable()
export class RoomsService {

  constructor (@InjectRepository(Room) private roomsRepository : Repository<Room>) {}

  async create(createRoomDto: CreateRoomDto) {
    return await this.roomsRepository.save(createRoomDto);
  }

  async findAll() {
    return await this.roomsRepository.find()
  }

  async findByName(name) {
      return await this.roomsRepository.findOne({where: {name: name}});
  }

  async findOne(id: number) {
    return await this.roomsRepository.findOne(id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
