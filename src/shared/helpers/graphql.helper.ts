import { Field, ObjectType } from '@nestjs/graphql';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { Type } from '@nestjs/common';
import { GenericResponsePayload } from '../interfaces/generic-response.interface';

export function genericResponsePayload<T>(T: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PageClass implements GenericResponsePayload<T>{
    @Field(() => HttpStatusCode)
    code: HttpStatusCode;

    @Field(() => T, { nullable: true })
    data?: T;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => String, { nullable: true })
    errorDescription?: string;
  }

  return PageClass;
}