import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/helpers/BaseEntity';
import { Role } from '../role/role.entity';
import { RefreshToken } from '../refresh_token/refresh_token.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  emailVerified?: boolean;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  gender: string;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
    eager: true
  })
  @JoinTable()
  roles?: Role[]

  @OneToMany(
    () => RefreshToken,
    (refreshToken) =>
      refreshToken.user,
    { eager: true },
  )
  refreshTokens: RefreshToken[];

  @Column({ default: false })
  suspended?: boolean;
}
