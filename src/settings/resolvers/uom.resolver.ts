import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Uom } from '../entities/uom.entity';
import { ResponseUom, ResponseUomPaginated } from '../responses/uom.response';
import { UomInput } from '../inputs/uom.input';
import { UomService } from '../services/uom.service';
import { PaginatedInput } from '../../shared/inputs/pagination.input';


@Resolver(of => Uom)
export class UomResolver {

  constructor(
    private readonly uomService: UomService,
  ) {
  }

  @Mutation(returns => ResponseUom)
  createUom(
    @Args('input')
    input: UomInput
  ) {
    return this.uomService.createUom(input);
  }

  @Mutation(returns => ResponseUom)
  updateUom(
    @Args('uuid')
    uuid: string,
    @Args('input')
    input: UomInput
  ) {
    return this.uomService.updateUom(uuid, input)
  }

  @Mutation(returns => ResponseUom)
  deleteUom(
    @Args('uuid')
    uuid: string,
  ) {
    return this.uomService.deleteUom(uuid)
  }

  @Query(returns => ResponseUomPaginated)
  getAllUomsPaginated(
    @Args('input')
    input: PaginatedInput
  ) {
    return this.uomService.getAllUomsPaginated(input);
  }

  @Query(returns => [Uom])
  getAllUoms(
  ) {
    return this.uomService.getAllUoms();
  }

}