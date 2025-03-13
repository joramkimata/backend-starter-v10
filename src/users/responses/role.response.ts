import { ObjectType } from "@nestjs/graphql";
import { genericResponsePayload } from "src/shared/helpers/graphql.helper";
import { responsePaginated } from "src/shared/helpers/response.helper";
import { Role } from "../entities/role.entity";


@ObjectType()
export class ResponseRolePaginated extends responsePaginated(Role) { }

@ObjectType()
export class ResponseRole extends genericResponsePayload(Role) { }