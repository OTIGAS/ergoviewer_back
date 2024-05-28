import { Router } from 'express'

import companyRoutes from './company.routes.js'
import contactRoutes from './contact.routes.js'
import addressRoutes from './address.routes.js'
import userRoutes from './user.routes.js'
import projectRoutes from './project.routes.js'
import departmentRoutes from './department.routes.js'

import fs from 'fs'
import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

const routes = Router()

routes.use('/company', companyRoutes)
routes.use('/contact', contactRoutes)
routes.use('/address', addressRoutes)
routes.use('/user', userRoutes)
routes.use('/project', projectRoutes)
routes.use('/department', departmentRoutes)

routes.get('/', (_req, res) => {
  res.status(200).json({ response: '🚀Server running🚀' })
})

const avatarPath =
  process.env.VERSION === 'PROD' ? path.join(__dirname, '../../../avatars') : path.join(__dirname, '../../avatars')

routes.get('/avatars/:fileName', (req, res) => {
  const { fileName } = req.params

  if (!fileName) {
    return res.status(400).json({ error: 'missingParameters' })
  }

  const filePath = path.join(avatarPath, fileName)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'fileNotFound' })
    }

    res.sendFile(filePath)
  })
})

export default routes
