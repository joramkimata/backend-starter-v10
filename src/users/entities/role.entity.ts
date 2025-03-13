import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Permission } from "./permission.entity";
import { BaseEntity } from "src/shared/entities/base.entity";




@Entity(`${process.env.DB_PREFIX}_roles`)
@ObjectType()
export class Role extends BaseEntity {

    @Field()
    @Column()
    name: string;

    @Column({ name: 'display_name' })
    @Field()
    displayName: string;

    @Column({ type: 'text', nullable: true })
    @Field({ nullable: true })
    description: string;

    @Field(type => [Permission], { nullable: true })
    @ManyToMany(type => Permission,)
    @JoinTable({
        name: `${process.env.DB_PREFIX}_role_permissions`,
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
    })
    permissions: Permission[];

    @Field()
    @Column({ name: 'is_permanent', default: false })
    isPermanent: boolean;
}