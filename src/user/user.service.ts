import { ConflictException, ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Status, UserType } from '@prisma/client';
import * as jwt from "jsonwebtoken";
import { emit } from 'process';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  //For JWT
  private generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 360000,
      },
    );
  }

  //User Registration
  async create({ createUserDto: CreateUserDto }, image?: File) {
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
        image: image,
      },
    });
  }

  //User Login
  async signIn(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) {
      //throw new HttpException("Invalid credentials",400);
      throw new ForbiddenException('Credentials incorrect');
    }
   
    // compare password
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(createUserDto.password, hashedPassword);

    // if password incorrect throw exception
    if (!isValidPassword) {
      throw new HttpException('Invalid Password', 400);
    }

    // quick fix to hide password
    delete user.password;

    const userName = user.email.concat(user.email);
    const token = await this.generateJWT(userName, user.id);

    // send back the user
    return { user: { ...user }, token };
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
