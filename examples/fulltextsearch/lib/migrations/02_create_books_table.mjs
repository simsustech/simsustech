export async function up(knex, Promise) {
  return knex.schema.createTable('books', function (table) {
    table.increments('id').primary()
    table.string('title')
    table.string('genre')
    table
      .integer('author_id')
      .unsigned()
      .references('authors.id')
      .onDelete('CASCADE')   
    // table.specificType('fulltext', 'tsvector');
    // table.index('fulltext', null, 'gin');
    table.timestamps(false, true)
  }).then(() => {
    return knex.schema.raw(`
    ALTER TABLE books
      ADD COLUMN fulltext tsvector
        GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(genre, ''))) STORED;
    CREATE INDEX books_fulltext_idx ON books USING GIN (fulltext);`)
  })
}

export async function down(knex, Promise) {
  return knex.schema.dropTable('books')
}
