import jsonwebtoken from 'jsonwebtoken'
const { sign, verify } = jsonwebtoken

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

export const ConfigGenereteToken = (data, first) => {
  return new Promise((resolve, reject) => {
    try {
      return resolve(
        sign(
          { id: data.id, tipo: data.tipo },
          `${process.env.JWT_SECRET}`,
          !first ? { expiresIn: '1d' } : { expiresIn: '60s' }
        )
      )
    } catch (error) {
      return reject(new Error(error))
    }
  })
}

export const ConfigDecodeToken = (request) => {
  return new Promise((resolve, reject) => {
    try {
      const token = request.headers.authorization?.split(' ')[1]
      return resolve(verify(token, process.env.JWT_SECRET))
    } catch (error) {
      return reject(new Error(error))
    }
  })
}
