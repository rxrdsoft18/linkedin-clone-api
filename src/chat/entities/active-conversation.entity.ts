import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active_conversation')
export class ActiveConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column({ unique: true })
  userId: number;
}
