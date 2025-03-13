import { registerEnumType } from "@nestjs/graphql";


export enum AttachableFormat {
    FILE = "FILE", IMAGE = "IMAGE",
}

registerEnumType(AttachableFormat, {
    name: 'AttachableFormat'
})