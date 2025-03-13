import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserInput {

    @Field()
    fullName: string

    @Field()
    username: string;

    @Field({ nullable: true })
    email: string;

    @Field()
    password: string;
}