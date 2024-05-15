import jsonwebtoken from 'jsonwebtoken'
const { verify } = jsonwebtoken

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

import { RespostaErro } from '../utils/handler.js'

export const verifica_token = (req, res, next) => {
  const auth = req?.headers?.authorization?.split(' ')[1]
  if (!auth) {
    return RespostaErro(401, res, req, { erro: 'Autenticação necessária!' })
  } else {
    verify(auth, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.log(error)
        return RespostaErro(401, res, req, { erro: 'Não autorizado!' })
      } else {
        req.user = decoded
        next()
      }
    })
  }
}

export const ControleAcesso = (req, res, next) => {
  const action = 'verificando o grau de autonomia'
  const id = req.user.id
  const tipo = req.user.tipo
  if (tipo == 'usuario') {
    next()
  } else {
    return RespostaErro(401, res, req, 'aluno', { erro: 'Não autorizado!' })
  }
}
