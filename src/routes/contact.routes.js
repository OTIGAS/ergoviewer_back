import { Router } from 'express'
const routes = Router()

import ContactController from '../controller/contact.controller.js'
const contactController = new ContactController()

routes.post(`/create`, contactController.create())

routes.get(`/find`, contactController.find())

routes.get(`/list`, contactController.list())

routes.put(`/update`, contactController.update())

routes.delete(`/delete`, contactController.delete())

export default routes
