import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from "@nestjs/common";
import { ResponsePayload } from '../interfaces/response-payload.interface';
import { HttpStatusCode } from '../enums/http-codes.enum';

function response<Type extends ResponsePayload>(
  data: any,
  response: Type | any,
  message = '',
  statusCode: HttpStatusCode = HttpStatusCode.SUCCESS,
  status = true,
): Type {
  response.code = statusCode;
  response.data = data;
  response.status = status;
  response.errorDescription = message;
  return response;
}

export function responsePaginated<T>(T: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PageClass {

    @Field(() => Int, { nullable: true })
    totalPages: number;

    @Field(() => [T], { nullable: true })
    items: T[];

    @Field(() => Int, { nullable: true })
    totalCount: number;

  }

  return PageClass;
}

export default response;