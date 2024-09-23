import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../common/helpers/BaseEntity';
import { Permission } from '../permission/permission.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
    eager: true
  })
  @JoinTable()
  permissions: Permission[]

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]
}
