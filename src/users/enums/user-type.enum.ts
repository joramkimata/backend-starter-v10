import { registerEnumType } from "@nestjs/graphql";


export enum UserTypeEnum {
    STAFF = "STAFF",
    ADMIN = "ADMIN"
}

registerEnumType(UserTypeEnum, {
    name: "UserTypeEnum"
})