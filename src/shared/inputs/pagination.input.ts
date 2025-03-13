import { Field, InputType, Int } from "@nestjs/graphql";


@InputType()
export class PaginatedInput {

  @Field(() => Int, { defaultValue: 1 })
  pageNumber: number;

  @Field(() => Int, { defaultValue: 10 })
  pageSize: number;

}