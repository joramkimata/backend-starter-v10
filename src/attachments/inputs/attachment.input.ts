import { Field, InputType } from "@nestjs/graphql"
import { AttachableFormat } from "../enums/attachable-format.enum"
import { AttachmentExtension } from "../enums/attachment-extension.enum"


@InputType()
export class AttachmentInput {
    @Field({ nullable: true })
    attachableUid?: string

    @Field(type => String)
    attachableType: string

    @Field(type => AttachableFormat)
    attachableFormat: AttachableFormat

    @Field()
    attachmentName: string

    @Field(type => AttachmentExtension)
    attachmentExtension: AttachmentExtension

    @Field()
    attachemntData: string

    @Field({ nullable: true })
    uuid?: string
}