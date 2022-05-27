require('dotenv').config()
const Knex = require('knex')

async function main () {
    const config = require(process.cwd() + '/knexfile')
    config.connection.database = null
    let knex = require('knex')(config)

    await knex.raw('CREATE DATABASE IF NOT EXISTS ??', process.env.DB_NAME)
    console.log(`Database ${process.env.DB_NAME} created`)
    config.connection.database = process.env.DB_NAME

    knex = Knex(config)

    await knex.migrate.latest()
    console.log(`Database ${process.env.DB_NAME} migrated`)
    await knex.destroy()
}

main().catch(console.log).then(process.exit)
