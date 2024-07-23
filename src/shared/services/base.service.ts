import { FindOptions, FindOptionsWhere, Not, Repository } from 'typeorm';
import { GenericPaginatedResponse } from '../interfaces/generic-paginated-response.interface';


export class BaseService {
  async getEntityById<T>(repo: Repository<T>, id: number, relations: string[]): Promise<T> {
    return repo.findOne({
      where: {
        deleted: false,
        id,
      } as any,
      relations,
    });
  }

  async checkRestExistanceNotId<T>(repo: Repository<T>, id: number, whereObject: FindOptionsWhere<T>, relations: string[] = []): Promise<T> {
    const obj = {
      deleted: false,
      id: Not(id),
      ...whereObject,
    };

    return repo.findOne({
      where: {
        deleted: false,
        id: Not(id),
      } as any,
    });

  }

  async getEntitys<T>(repo: Repository<T>, relations: string[]): Promise<T[]> {
    return repo.find({
      where: {
        deleted: false,
      } as any,
      relations,
    });
  }

  async getPaginatedData<T>(repo: Repository<T>, pageNumber: number, pageSize: number, relations: string[] = []): Promise<GenericPaginatedResponse<T>> {
    const [items, totalCount] = await repo.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      relations,
    });

    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // You can also calculate totalPages here
    };
  }

  async searchPaginatedWithUser<T>(repo: Repository<T>, searchTerm: string, page: number = 1, perPage: number = 10, userId: number): Promise<GenericPaginatedResponse<T>> {


    const queryBuilder = repo.createQueryBuilder('entity');

    // Get the column names of the entity
    const columns = repo.metadata.columns.map((column) => column.propertyName);

    // Filter the text-based columns
    const textColumns = columns.filter((column) => repo.metadata.findColumnWithPropertyName(column).type === 'varchar' || repo.metadata.findColumnWithPropertyName(column).type === 'text');


    // If there is a search term, create a WHERE clause for each text-based column
    if (searchTerm) {

      const whereClauses = textColumns.map((column) => `entity.${column} ILIKE :searchTerm`);
      const whereCondition = whereClauses.join(' OR ');

      // Add the 'searchTerm' parameter to the query
      queryBuilder.setParameter('searchTerm', `%${searchTerm}%`);

      // Add the WHERE condition to the query
      queryBuilder.andWhere(`(${whereCondition})`);
    }

    // Add the 'deleted = false' condition
    queryBuilder.andWhere('entity.deleted = false');

    // Add the 'deleted_at IS NULL' condition to exclude soft-deleted records
    queryBuilder.andWhere(`entity.user_id = ${userId}`);

    // Calculate the total count using the same query with COUNT(*) and deleted = false condition
    const totalCountQuery = repo.createQueryBuilder('entity');
    totalCountQuery.where('entity.deleted = false');
    totalCountQuery.andWhere(`entity.user_id = ${userId}`);

    if (searchTerm) {
      const whereClauses = textColumns.map((column) => `entity.${column} ILIKE :searchTerm`);
      const whereCondition = whereClauses.join(' OR ');

      // Add the 'searchTerm' parameter to the total count query
      totalCountQuery.setParameter('searchTerm', `%${searchTerm}%`);

      // Add the WHERE condition to the total count query
      totalCountQuery.andWhere(`(${whereCondition})`);
    }
    const totalCount = await totalCountQuery.getCount();

    // Calculate the offset based on the page and perPage values
    const offset = (page - 1) * perPage;

    // Set the LIMIT, OFFSET, and ORDER BY for pagination and sorting
    queryBuilder.take(perPage).skip(offset).orderBy('entity.id', 'DESC');

    // Execute the query to get the paginated results
    const items = await queryBuilder.getMany();

    const totalPages = Math.ceil(totalCount / perPage);

    return {
      items,
      totalCount,
      totalPages,
    };
  }

  async searchPaginated<T>(repo: Repository<T>, searchTerm: string, page: number = 1, perPage: number = 10): Promise<GenericPaginatedResponse<T>> {


    const queryBuilder = repo.createQueryBuilder('entity');

    // Get the column names of the entity
    const columns = repo.metadata.columns.map((column) => column.propertyName);

    // Filter the text-based columns
    const textColumns = columns.filter((column) => repo.metadata.findColumnWithPropertyName(column).type === 'varchar' || repo.metadata.findColumnWithPropertyName(column).type === 'text');


    // If there is a search term, create a WHERE clause for each text-based column
    if (searchTerm) {

      const whereClauses = textColumns.map((column) => `entity.${column} ILIKE :searchTerm`);
      const whereCondition = whereClauses.join(' OR ');

      // Add the 'searchTerm' parameter to the query
      queryBuilder.setParameter('searchTerm', `%${searchTerm}%`);

      // Add the WHERE condition to the query
      queryBuilder.andWhere(`(${whereCondition})`);
    }

    // Add the 'deleted = false' condition
    queryBuilder.andWhere('entity.deleted = false');


    // Calculate the total count using the same query with COUNT(*) and deleted = false condition
    const totalCountQuery = repo.createQueryBuilder('entity');
    totalCountQuery.where('entity.deleted = false');

    if (searchTerm) {
      const whereClauses = textColumns.map((column) => `entity.${column} ILIKE :searchTerm`);
      const whereCondition = whereClauses.join(' OR ');

      // Add the 'searchTerm' parameter to the total count query
      totalCountQuery.setParameter('searchTerm', `%${searchTerm}%`);

      // Add the WHERE condition to the total count query
      totalCountQuery.andWhere(`(${whereCondition})`);
    }
    const totalCount = await totalCountQuery.getCount();

    // Calculate the offset based on the page and perPage values
    const offset = (page - 1) * perPage;

    // Set the LIMIT, OFFSET, and ORDER BY for pagination and sorting
    queryBuilder.take(perPage).skip(offset).orderBy('entity.id', 'DESC');

    // Execute the query to get the paginated results
    const items = await queryBuilder.getMany();

    const totalPages = Math.ceil(totalCount / perPage);

    return {
      items,
      totalCount,
      totalPages,
    };
  }

  async getPaginatedDataWhere<T>(repo: Repository<T>, pageNumber: number, pageSize: number, whereObject: FindOptionsWhere<T>, relations: string[] = []): Promise<GenericPaginatedResponse<T>> {

    const obj = {
      deleted: false,
      ...whereObject
    } as any


    const [items, totalCount] = await repo.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      where: obj,
      order: {
        id: 'DESC'
      } as any,
      relations
    });


    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // You can also calculate totalPages here
    };
  }

}
