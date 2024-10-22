import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventLog {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column({nullable: false})
     action: string;
     
     @Column({nullable: false})
     productId: string;

     @CreateDateColumn()
     timestamp: Date;
}