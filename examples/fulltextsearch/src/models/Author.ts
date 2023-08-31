import { Model, snakeCaseMappers } from "objection";

export class Author extends Model {
  id!: number;
  name!: string;
  city!: string;
  static get tableName() {
    return "authors";
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }
}
