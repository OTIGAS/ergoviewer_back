import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { hash, compare } from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
const { sign, verify } = jsonwebtoken

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

export const UtilEncrypt = async (value) => {
  const iv = Buffer.from(randomBytes(16))
  const cipher = createCipheriv(process.env.ALGORITHM_CRYPTO, Buffer.from(process.env.CRYPTO_SECRET), iv)
  let encrypted = cipher.update(value)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const UtilDecrypt = async (crypted) => {
  const [iv, encrypted] = crypted.split(':')
  const ivBuffer = Buffer.from(iv, 'hex')
  const decipher = createDecipheriv(process.env.ALGORITHM_CRYPTO, Buffer.from(process.env.CRYPTO_SECRET), ivBuffer)
  let value = decipher.update(Buffer.from(encrypted, 'hex'))
  value = Buffer.concat([value, decipher.final()])
  return value.toString()
}

export const UtilGenerateHash = async (value) => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10
    hash(value, saltRounds, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

export const UtilCheckHash = async (value, hash) => {
  return new Promise((resolve, reject) => {
    compare(value, hash, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export const UtilGenerateToken = async (data, first) => {
  try {
    const token = await sign(
      { id: data.id, user_role: data.role },
      process.env.JWT_SECRET,
      !first ? { expiresIn: '1d' } : { expiresIn: '60s' }
    )
    return token
  } catch (error) {
    throw new Error(error)
  }
}

export const UtilDecodeToken = async (request) => {
  try {
    const token = request.headers.authorization?.split(' ')[1]
    if (!token) throw new Error('No token provided')
    const decoded = await verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    throw new Error(error)
  }
}
