import { Injectable } from '@nestjs/common';
import { UomInput } from '../inputs/uom.input';
import { BaseService } from '../../shared/services/base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Uom } from '../entities/uom.entity';
import { ResponseUom } from '../responses/uom.response';
import response from '../../shared/helpers/response.helper';
import { HttpStatusCode } from '../../shared/enums/http-codes.enum';
import { PaginatedInput } from '../../shared/inputs/pagination.input';

@Injectable()
export class UomService extends BaseService {

  private rels = [];

  constructor(
    @InjectRepository(Uom)
    private readonly uomRepo: Repository<Uom>,
  ) {
    super();
  }

  async createUom(input: UomInput) {
    const res = new ResponseUom();

    const dbUom = await this.uomRepo.findOne({
      where: {
        name: input.name,
      },
    });

    if (dbUom) {
      return response(null, res, 'Uom exists', HttpStatusCode.DUPLICATE);
    }

    const newUom = new Uom();
    newUom.name = input.name;

    const saved = await this.uomRepo.save(newUom);

    return response(this.getEntityById(this.uomRepo, saved.id, this.rels), res);
  }

  async deleteUom(uuid: string) {
    const res = new ResponseUom();

    const dbUom = await this.uomRepo.findOne({
      where: {
        uuid,
        deleted: false
      },
    });

    if (!dbUom) {
      return response(null, res, 'UOM not found', HttpStatusCode.NO_FOUND);
    }

    dbUom.deleted = true;

    const saved = await this.uomRepo.save(dbUom)

    return response(
      this.getEntityById(
        this.uomRepo,
        saved.id,
        this.rels
      ),
      res
    );
  }

  async updateUom(uuid: string, input: UomInput) {
    const res = new ResponseUom();

    const dbUom = await this.uomRepo.findOne({
      where: {
        uuid,
        deleted: false
      },
    });

    if (!dbUom) {
      return response(null, res, 'UOM not found', HttpStatusCode.NO_FOUND);
    }

    const elseUom = await this.checkRestExistanceNotId(
      this.uomRepo,
      dbUom.id,
      {
        name: input.name,
      }
    );

    if (elseUom) {
      return response(null, res, 'UOM exists', HttpStatusCode.DUPLICATE);
    }


    dbUom.name = input.name;

    const saved = await this.uomRepo.save(dbUom)

    return response(
      this.getEntityById(
        this.uomRepo,
        saved.id,
        this.rels
      ),
      res
    );

  }

  getAllUoms() {
    return this.getEntitys<Uom>(this.uomRepo, this.rels);
  }

  getAllUomsPaginated(input: PaginatedInput) {
    return this.getPaginatedDataWhere(
      this.uomRepo,
      input.pageNumber,
      input.pageSize,
      { deleted: false } as any,
      this.rels,
    );
  }
}
