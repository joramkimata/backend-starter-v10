import { ObjectType } from '@nestjs/graphql';
import { Uom } from '../entities/uom.entity';
import { responsePaginated } from '../../shared/helpers/response.helper';
import { genericResponsePayload } from '../../shared/helpers/graphql.helper';

@ObjectType()
export class ResponseUomPaginated extends responsePaginated(Uom) { }

@ObjectType()
export class ResponseUom extends genericResponsePayload(Uom) { }