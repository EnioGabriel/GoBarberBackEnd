import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("notifications")
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  // Id que irá receber a msg
  @Column("uuid")
  recipient_id: string;

  // Verifica se a msg foi lida ou não
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
