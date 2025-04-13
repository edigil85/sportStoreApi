import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Product {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column('double')
  price!: number;

  @Column('int')
  stock!: number;

  @Column()
  brand!: string;
}
