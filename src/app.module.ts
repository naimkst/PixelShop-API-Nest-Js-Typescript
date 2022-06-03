import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.modle';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
