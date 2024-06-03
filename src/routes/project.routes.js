import { Router } from 'express'
const routes = Router()

import ProjectController from '../controller/project.controller.js'
const projectController = new ProjectController()

routes.post(`/create`, projectController.create())

routes.get(`/find`, projectController.find())

routes.get(`/list`, projectController.list())

routes.put(`/update`, projectController.update())

routes.delete(`/delete`, projectController.delete())

export default routes
