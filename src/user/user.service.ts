import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { Status, UserType } from '@prisma/client';

@Injectable()
export class UserService {

  constructor( private prismaService: PrismaService) {}

  //User Registration
  async create({ createUserDto: CreateUserDto } , image?: File) {
    console.log('Post Service #######', image);

    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: CreateUserDto.email,
      },
    });
    if (userExists) {
      throw new ConflictException(`user ${CreateUserDto.email} already exist`);
    }
    const hashedPassword = await bcrypt.hash(CreateUserDto.password, 10);
    return this.prismaService.user.create({
      data: {
        ...CreateUserDto,
        password: hashedPassword,
        role: UserType.USER,
        emailVerified: Status.ACTIVE,
        status: Status.ACTIVE,
        image: image
      }
    })
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
