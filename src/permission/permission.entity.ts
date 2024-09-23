import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../common/helpers/BaseEntity';
import { Role } from '../role/role.entity';

@Entity({ name: 'permission' })
export class Permission extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[]
}
