import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { existsSync, mkdirSync, appendFile } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const folder_path = join(__dirname, '..', '..', 'logs')

const reset_color = '\x1b[0m'
const erro_color = '\x1b[31m'

export const ResponseSuccess = async (code, res, _req, response) => {
  response.ok = 'true'
  return res.status(code).send(response)
}

export const ResponseError = async (code, res, _req, response) => {
  response.ok = 'false'
  return res.status(code).send(response)
}

export const ResponseFailure = (code, res, req, response, erro) => {
  if (response == null) {
    response = {
      failure: 'serverFailure',
      ok: 'false',
    }
  } else {
    response.ok = 'false'
  }
  if (!existsSync(folder_path)) {
    mkdirSync(folder_path)
  }
  const arquivo = join(folder_path, `${new Date().toISOString().split('T')[0]}.txt`)
  const data = new Date().toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  appendFile(arquivo, `${data} - ${req?.method?.toUpperCase()} ${req.baseUrl}${req.path} -> ${erro}\n`, (err) => {
    if (err) throw err
  })
  console.error(erro_color + req?.method?.toUpperCase() + ' ' + req.baseUrl + req.path + ' -> ' + erro + reset_color)
  return res.status(code).send(response)
}
