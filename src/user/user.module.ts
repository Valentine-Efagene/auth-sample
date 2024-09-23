import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { S3UploaderModule } from '../s3-uploader/s3-uploader.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), S3UploaderModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
