import { Column, Entity } from "typeorm"
import { AttachableFormat } from "../enums/attachable-format.enum"
import { BaseEntity } from "src/shared/entities/base.entity"
import { Field, ObjectType } from "@nestjs/graphql"
import { AttachmentExtension } from "../enums/attachment-extension.enum"


@Entity(`${process.env.DB_PREFIX}_attachments`)
@ObjectType()
export class Attachment extends BaseEntity {

    @Column({ name: 'attachable_uid' })
    @Field()
    attachableUid: string

    @Column({ name: 'attachable_type' })
    @Field(type => String)
    attachableType: string

    @Column({ name: 'attachable_format', type: 'enum', enum: AttachableFormat })
    @Field(type => AttachableFormat)
    attachableFormat: AttachableFormat

    @Column({ name: 'attachable_name' })
    @Field()
    attachmentName: string

    @Column({ name: 'attachable_orginal_name' })
    @Field()
    attachmentOGName: string

    @Column({ name: 'attachable_extension', type: 'enum', enum: AttachmentExtension })
    @Field()
    attachmentExtension: AttachmentExtension

    @Column({ name: 'attachable_data', type: 'text' })
    @Field()
    attachemntData: string

    @Column({ name: 'attachable_drive_location' })
    @Field()
    attachemntDriveLocation: string
}