import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  //Constructor
  constructor(private prismaService: PrismaService) {}

  //Create Product
  async create({ createProductDto: CreateProductDto }, image?: File) {
    return this.prismaService.product.create({
      data: {
        ...CreateProductDto,
        image: image,
      },
    });
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const remove = await this.prismaService.product.delete({
      where: {
        id,
      }
    })
    console.log(remove);
    return this.prismaService.product.findMany();
  }

  async postPaginate(params: {
    skip?: number;
    take?: number;
    search?: string;
  }) {
    const { skip, take, search } = params;

    const countPost = await this.prismaService.product.count();
    const paginateButton = Math.ceil(countPost / take);

    console.log(skip, take, countPost, paginateButton);
    if (isNaN(skip)) {
      return await this.prismaService.product.findMany({
        take,
      });
    } else {
      const paginateData = await this.prismaService.product.findMany({
        skip,
        take,
        where: {
          title: {
            contains: search,
          },
        },
      });
      return {
        totalPage: paginateButton,
        data: paginateData,
      };
    }
  }
}
