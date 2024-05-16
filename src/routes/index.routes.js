import { Router } from 'express'

import analyticsCompanyRoutes from './analytics-company.routes.js'
import subjectCompanyRoutes from './subject-company.routes.js'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

const routes = Router()

routes.use('/analytics-company', analyticsCompanyRoutes)
routes.use('/subject-company', subjectCompanyRoutes)

routes.get('/', (_req, res) => {
  res.status(200).json({ response: '🚀!Server running!🚀' })
})

export default routes
