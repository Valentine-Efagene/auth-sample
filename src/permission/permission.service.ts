import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const entity = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(entity);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  findOne(id: number): Promise<Permission> {
    return this.permissionRepository.findOneBy({ id });
  }

  async updateOne(id: number, updateDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });

    if (!permission) {
      throw new NotFoundException(`${Permission.name} with ID ${id} not found`);
    }

    this.permissionRepository.merge(permission, updateDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
