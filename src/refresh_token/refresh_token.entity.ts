import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/helpers/BaseEntity';
import { User } from '../user/user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: false })
  token: string;
}
