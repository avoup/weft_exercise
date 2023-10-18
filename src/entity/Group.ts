import {Entity, PrimaryGeneratedColumn, Column, Index, Unique, OneToMany} from "typeorm"
import {GroupStatusEnum} from "./enums/group";
import {User} from "./User";

@Entity()
export class Group {

    @PrimaryGeneratedColumn()
    id: number

    @Index({ unique: true })
    @Column()
    name: string

    @Column({ default: GroupStatusEnum.EMPTY })
    status: GroupStatusEnum

    @OneToMany(() => User, (user) => user.group)
    users?: User[]
}