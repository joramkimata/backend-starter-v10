import { registerEnumType } from "@nestjs/graphql";

export enum AttachmentExtension {
    PDF = "PDF", PNG = "PNG", JPG = "JPG"
}

registerEnumType(AttachmentExtension, {
    name: 'AttachmentExtension'
})