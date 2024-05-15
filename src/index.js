import express, { json } from 'express'
import { createServer } from 'https'
import cors from 'cors'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../.env' })

import { certs, keys } from './utils/ssl.js'

import morgan from 'morgan'

import routes from './routes/index.routes.js'

const PORT = process.env.PORT

const TODAY = new Date().toLocaleDateString('pt-BR')
const HORS = new Date().toLocaleTimeString('pt-BR')

const cert = process.env.VERSION === 'PROD' ? certs('ergoviewer_') : undefined
const key = process.env.VERSION === 'PROD' ? keys(cert) : undefined

const cors_options = {
  origin: process.env.VERSION === 'PROD' ? '*' : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
}

const options =
  process.env.VERSION === 'PROD'
    ? {
        key: readFileSync(__dirname + '/../../ssl/keys/' + key),
        cert: readFileSync(__dirname + '/../../ssl/certs/' + cert),
      }
    : {}

const app = express()

app.use(cors(cors_options))
app.use(json())
app.use(morgan('dev'))
app.use(routes)

if (process.env.VERSION === 'PROD') {
  createServer(options, app).listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    console.log(`Last update: ${TODAY} - ${HORS}`)
  })
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    console.log(`Last update: ${TODAY} - ${HORS}`)
  })
}
