import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMutesDto } from "./dto/update-mutes.dto";
import { UpdateMutesToMeDto } from "./dto/update-mutes-to-me.dto";
import { User } from "./entities/user.entity";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':name/name')
  findByName(@Param('name') name) {
    return this.usersService.findByName(name);
  }

  @Get(':socket/socket')
  findBySocket(@Param('socket') socket) {
      return this.usersService.findBySocket(socket);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/updateMutes')
  updateUsers(@Body() updateMutesDto: UpdateMutesDto) {
    return this.usersService.updateMutes(updateMutesDto);
  }

  @Patch('/updateMutesToMe')
  updateMutesToMe(@Body() updateMutesToMeDto: UpdateMutesToMeDto) {
    return this.usersService.updateMutesToMe(updateMutesToMeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
