import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { existsSync, mkdirSync, appendFile } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const caminho_pasta = join(__dirname, '..', '..', 'logs')

const reset_color = '\x1b[0m' //* Reseta a cor do console.
const erro_color = '\x1b[31m' //* Cor vermelha para erros.

export const RespostaSucesso = async (codigo, res, _req, resposta) => {
  resposta.ok = 'true'
  return res.status(codigo).send(resposta)
}

export const RespostaErro = async (codigo, res, _req, resposta) => {
  resposta.ok = 'false'
  return res.status(codigo).send(resposta)
}

export const RespostaFalha = (codigo, res, req, resposta, erro) => {
  if (resposta == null) {
    resposta = { 
      erro: 'Falha no servidor', 
      ok: 'false' 
    }
  } else {
    resposta.ok = 'false'
  }
  if (!existsSync(caminho_pasta)) {
    mkdirSync(caminho_pasta)
  }
  const arquivo = join(caminho_pasta, `${new Date().toISOString().split("T")[0]}.txt`)
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
  return res.status(codigo).send(resposta)
}