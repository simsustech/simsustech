export async function up(knex, Promise) {
  return knex.schema.createTable('authors', function (table) {
    table.increments('id').primary()
    table.string('name')
    table.string('city')
    // table.specificType('fulltext', 'tsvector');
    // table.index('fulltext', null, 'gin');
    table.timestamps(false, true)
  }).then(() => {
    return knex.schema.raw(`
    ALTER TABLE authors
      ADD COLUMN fulltext tsvector
        GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(city, ''))) STORED;
    CREATE INDEX authors_fulltext_idx ON authors USING GIN (fulltext);`)
  })
}

export async function down(knex, Promise) {
  return knex.schema.dropTable('authors')
}
