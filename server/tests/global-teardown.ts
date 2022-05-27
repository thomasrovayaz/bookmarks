import Knex from 'knex'
import config from '../knexfile'

module.exports = async () => {
    const knex = Knex(config)
    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
