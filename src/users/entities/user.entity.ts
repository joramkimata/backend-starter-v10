import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Role } from "./role.entity";
import { BaseEntity } from "src/shared/entities/base.entity";



@Entity(`${process.env.DB_PREFIX}_users`)
@ObjectType()
export class User extends BaseEntity {

    @Column()
    @Field()
    username: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;

    @Column({
        name: "user_type",
        type: "enum",
        enum: UserTypeEnum,
        nullable: true
    })
    @Field(type => UserTypeEnum, { nullable: true })
    userType: UserTypeEnum

    @Field()
    @Column({ default: false })
    active: boolean = false;

    @Field(type => [Role], { nullable: true })
    @ManyToMany(type => Role,)
    @JoinTable({
        name: `${process.env.DB_PREFIX}_user_roles`,
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: Role[];

}