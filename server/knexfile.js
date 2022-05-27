module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_POST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    migrations: {
        tableName: 'migrations'
    },
    createTablesSafely: knex => tables => {
        const createTables = tables.map(({ name, schema }) => {
            return knex.schema.createTable(name, schema)
        })

        return Promise.all(createTables)
            .catch(e => {
                const dropTables = tables.map(({ name }) => {
                    return knex.schema.dropTableIfExists(name)
                })

                return Promise.all(dropTables).then(() => Promise.reject(e))
            })
    }
}
