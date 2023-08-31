import { Model, snakeCaseMappers, raw } from "objection";
import { knex } from "../index.js";
export class Book extends Model {
  id!: number;
  title!: string;
  genre!: string;
  static get tableName() {
    return "books";
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static async search(searchPhrase: string) {
    const searchTerms = searchPhrase.split(" ");

    const query = `
    with main as (
      select 
        b.id, 
        b.author_id, 
        b.title, 
        b.genre 
      from 
        books b 
        inner join authors a on b.author_id = a.id 
      where 
        b.fulltext @@ to_tsquery(
          'english', '${searchTerms.map((term) => term + ":*").join(" | ")}'
          )
    ), relation as (
      select 
        b.id, 
        b.author_id, 
        b.title, 
        b.genre 
      from 
        books b 
        inner join authors a on b.author_id = a.id 
      where 
        a.fulltext @@ to_tsquery(
          'english', '${searchTerms.map((term) => term + ":*").join(" | ")}'
        )
    )
    select distinct on (id) * from main union select * from relation;
    `;

    const result = await knex.raw(query);
    return result.rows.map((row: Record<string, any>) => this.fromJson(row));
  }
}
