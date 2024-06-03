import express, { json } from 'express'
import cors from 'cors'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../.env' })

import morgan from 'morgan'

import routes from './routes/index.routes.js'

const PORT = process.env.PORT

const TODAY = new Date().toLocaleDateString('pt-BR')
const HORS = new Date().toLocaleTimeString('pt-BR')

const cors_options = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
}

const app = express()

app.use(cors(cors_options))
app.use(json())
app.use(morgan('dev'))
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
  console.log(`Last update: ${TODAY} - ${HORS}`)
})
