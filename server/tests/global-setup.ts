/* eslint-disable import/first */
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
import Knex from 'knex'
import config from '../knexfile'

// Create the database
async function createTestDatabase () {
    const knex = Knex({
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_POST),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    })

    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`)
        await knex.raw(`CREATE DATABASE ${process.env.DB_NAME}`)
    } catch (error) {
        throw new Error(error)
    } finally {
        await knex.destroy()
    }
}

// Seed the database with schema and data
async function seedTestDatabase () {
    const knex = Knex(config)

    try {
        await knex.migrate.latest()
        await knex.seed.run()
    } catch (error) {
        throw new Error(error)
    } finally {
        await knex.destroy()
    }
}

module.exports = async () => {
    try {
        await createTestDatabase()
        console.log('Test database created successfully')
        await seedTestDatabase()
        console.log('Test database filled successfully')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
