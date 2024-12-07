import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('IDX_USERNAME', ['username']) // Enforces uniqueness for the 'username' column
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: true })
  profile_picture?: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ default: 0 })
  score: number;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: 0 })
  match_played: number;

  @Column({ default: 0 })
  match_failed: number;

  @Column({ default: 0 })
  match_win: number;

  @Column()
  rank: number;

  @Column()
  last_log_in_date: Date;
}
