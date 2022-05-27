exports.up = async function (knex) {
    await knex.schema.createTable('bookmarks', function (table) {
        table.increments('id').primary().unique()
        table.string('url').unique()
        table.string('type')
        table.string('title')
        table.string('thumbnail')
        table.string('author')
        table.string('createdAt')
        table.integer('duration')
        table.integer('width')
        table.integer('height')
    })
}

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('bookmarks')
}
