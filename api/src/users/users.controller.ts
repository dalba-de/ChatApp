import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMutesDto } from "./dto/update-mutes.dto";
import { UpdateMutesToMeDto } from "./dto/update-mutes-to-me.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from "./entities/user.entity";

@Controller('users')
@ApiTags('user')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiResponse({description: 'Create a new user'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({description: 'Returns all users'})
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':name/name')
  @ApiResponse({description: 'Returns a user finding it by name'})
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Get(':socket/socket')
  @ApiResponse({description: 'Returns a user finding it by socket'})
  findBySocket(@Param('socket') socket: string) {
      return this.usersService.findBySocket(socket);
  }

  @Get(':id')
  @ApiResponse({description: 'Returns a user finding it by id'})
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/updateMutes')
  @ApiResponse({description: 'Update the users that I have muted'})
  updateUsers(@Body() updateMutesDto: UpdateMutesDto) {
    return this.usersService.updateMutes(updateMutesDto);
  }

  @Patch('/updateMutesToMe')
  @ApiResponse({description: 'Update the users that have me muted'})
  updateMutesToMe(@Body() updateMutesToMeDto: UpdateMutesToMeDto) {
    return this.usersService.updateMutesToMe(updateMutesToMeDto);
  }

  @Patch(':id')
  @ApiResponse({description: 'Update user'})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({description: 'Remove user'})
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
