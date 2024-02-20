import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity({ name: 'blogs' })
export class Blog {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    title: string;

    @Column({ nullable: false})
    content: string;

    @Column({ nullable: false})
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}