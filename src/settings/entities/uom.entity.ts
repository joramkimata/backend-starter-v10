import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';


@Entity(`${process.env.DB_PREFIX}_uoms`)
@ObjectType()
export class Uom extends BaseEntity {

  @Column()
  @Field()
  name: string;

}