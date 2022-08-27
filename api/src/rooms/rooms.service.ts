import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { MakePublicRoomDto } from "./dto/make-public-room.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Room } from "./entities/room.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomsService {

  constructor (@InjectRepository(Room) private roomsRepository : Repository<Room>) {}

  async create(createRoomDto: CreateRoomDto) {
    if (createRoomDto.password !== null) {
      const hashedPassword = await bcrypt.hash(createRoomDto.password, 10);
      createRoomDto.password = hashedPassword;
      return await this.roomsRepository.save(createRoomDto);
    }
    else{
      return await this.roomsRepository.save(createRoomDto);
    }
  }

  async findAll() {
    return await this.roomsRepository.find()
  }

  async findByName(name) {
      return await this.roomsRepository.findOne({where: {name: name}});
  }

  async findUsersInRoom(name) {
    const findName = name;

    return await this.roomsRepository.createQueryBuilder('rooms')
      .innerJoin('rooms.users', 'rooms_users')
      .where("rooms_users.name = :findName", {findName} )
      .getMany();
  }

  async findAdminsInRoom(name) {
    const findName = name;

    return await this.roomsRepository.createQueryBuilder('rooms')
    .innerJoin('rooms.admins', 'rooms_admins')
    .where("rooms_admins.name = :findName", {findName} )
    .getMany();
  }

  async findOne(id: number) {
    return await this.roomsRepository.findOne(id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);
    updatePasswordDto.password = hashedPassword;
    return await this.roomsRepository.save(updatePasswordDto);
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    return await this.roomsRepository.save(updateRoomDto);
  }

  async updateAdmins(updateAdminDto: UpdateAdminDto) {
    return await this.roomsRepository.save(updateAdminDto);
  } 

  async makePublic(makePublicRoomDto: MakePublicRoomDto) {
    return await this.roomsRepository.save(makePublicRoomDto);
  }

  async remove(id: number) {
    return this.roomsRepository.delete(id);
  }

  public async getAuthenticatedRoom(name: string, plainTextPassword: string) {
    try {
      const room = await this.roomsRepository.findOne({where: {name: name}});
      await this.verifyPasword(plainTextPassword, room.password);
      return room;
    } catch (error) {
      throw new HttpException(
        'Wrong password provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  private async verifyPasword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
