import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, Column } from "typeorm";
import { PermissionGroupName } from "../enums/permission-group-name.enum";
import { BaseEntity } from "src/shared/entities/base.entity";


@Entity(`${process.env.DB_PREFIX}_permissions`)
@ObjectType()
export class Permission extends BaseEntity {
    @Field()
    @Column()
    name: string;

    @Column({ name: 'display_name' })
    @Field()
    displayName: string;

    @Column({ type: 'text', nullable: true })
    @Field({ nullable: true })
    description: string;

    @Column({ name: 'permission_group_name' })
    @Field(type => PermissionGroupName)
    permissionGroupName: PermissionGroupName;

    @Field({ nullable: true })
    belongToThisRole: Boolean;
}