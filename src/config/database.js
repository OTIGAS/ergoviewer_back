import mysql from 'mysql2/promise'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  multipleStatements: true,
  charset: 'utf8mb4',
}

export const db = async () => {
  try {
    const connection = await mysql.createConnection(config)
    return connection
  } catch (error) {
    console.log('Database connection error: ', error)
    throw error
  }
}
