import {Entity, PrimaryGeneratedColumn, Column, Index, Unique, ManyToOne} from "typeorm"
import {UserStatusEnum} from "./enums/user";
import {Group} from "./Group";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: UserStatusEnum.ACTIVE })
    status: UserStatusEnum

    @Index({ unique: true })
    @Column()
    email: string

    @ManyToOne(() => Group, (group) => group.users)
    group?: Group
}
