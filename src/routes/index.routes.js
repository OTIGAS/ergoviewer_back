import { Router } from 'express'

import usuarioRoutes from './analytics-company.routes.js'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

const routes = Router()

routes.use('/usuario', usuarioRoutes)

routes.get('/', (_req, res) => {
  res.status(200).json({ response: 'Servidor rodando.' })
})

export default routes
