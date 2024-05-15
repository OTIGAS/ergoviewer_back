import { createConnection } from 'mysql2/promise';

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

export const db = () => {
  return new Promise((resolve, reject) => {
    try {
      const connection = createConnection(config);
      resolve(connection);
    } catch (error) {
      console.log("Erro ao criar conexão:", error);
      reject(error);
    }
  });
};
