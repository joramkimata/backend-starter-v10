import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class UomInput {

  @Field()
  name: string
}