import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@tester.com',
  })
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 12345678,
  })
  @IsNotEmpty()
  @MaxLength(50)
  @IsStrongPassword()
  password: string;

  @ApiProperty({ nullable: true, example: 'Jane' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ nullable: true, example: 'Doe' })
  @IsOptional()
  lastName?: string;
}


export class UpdateUserDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({ nullable: true, example: 'Jane' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ nullable: true, example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ nullable: true, example: 'Aliqua laborum non ea aliquip ipsum dolor laborum amet aute sint non cillum dolore. Eu dolore ullamco anim est ullamco ipsum Lorem labore in aliquip proident commodo aute laborum. Reprehenderit proident esse laboris non irure cillum adipisicing ut occaecat deserunt anim. Cillum do nisi Lorem ipsum tempor exercitation irure laboris amet culpa labore. Culpa laborum consequat duis sit laboris do aute aliquip consectetur elit labore pariatur non.' })
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ nullable: true, example: 'Aliqua laborum non ea aliquip ipsum' })
  @IsOptional()
  address?: string;
}

export class UpdateUserControllerDto extends UpdateUserDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'The file to be uploaded',
    example: 'example.pdf',
  })
  @IsOptional()
  file?: Express.Multer.File;
}

export class AvatarUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to be uploaded',
    example: 'example.pdf',
  })
  file: Express.Multer.File;
}

export class SuspendUserDto {
  @ApiProperty({
    example: 'Unverified email',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  reason: string
}

export class AssignRolesDto {
  @ApiProperty({
    nullable: true,
    type: 'number',
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  roleIds: number[];
}