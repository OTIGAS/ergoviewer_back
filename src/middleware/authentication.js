import jsonwebtoken from 'jsonwebtoken'
const { verify } = jsonwebtoken

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

import { ResponseError } from '../util/handler.js'

export const check_token = (req, res, next) => {
  const auth = req?.headers?.authorization?.split(' ')[1]
  if (!auth) {
    return ResponseError(401, res, req, { error: `authenticationRequired` })
  } else {
    verify(auth, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.log(error)
        return ResponseError(401, res, req, { error: `unauthorized` })
      } else {
        req.user = decoded
        next()
      }
    })
  }
}
