import { InputType, Field } from "@nestjs/graphql";


@InputType()
export class AssignRolesInput {

    @Field()
    userUUID: string;

    @Field(type => [String])
    roleUUIDs: string[];

}