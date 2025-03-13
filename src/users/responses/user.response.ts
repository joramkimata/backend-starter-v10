import { ObjectType } from "@nestjs/graphql";
import { genericResponsePayload } from "src/shared/helpers/graphql.helper";
import { responsePaginated } from "src/shared/helpers/response.helper";
import { User } from "../entities/user.entity";


@ObjectType()
export class ResponseUserPaginated extends responsePaginated(User) { }

@ObjectType()
export class ResponseUser extends genericResponsePayload(User) { }