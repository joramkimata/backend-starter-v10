import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class AttachmentQueryInput {

    @Field()
    attachableUuid: string;

    @Field()
    attachableType: string
}