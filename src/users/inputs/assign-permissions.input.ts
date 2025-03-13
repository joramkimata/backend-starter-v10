import { InputType, Field } from "@nestjs/graphql";


@InputType()
export class AssignPermissionsInput {

    @Field()
    roleUUID: string;

    @Field(type => [String])
    permissionUUIDs: string[];

}