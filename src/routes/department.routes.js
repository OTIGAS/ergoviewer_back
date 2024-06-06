import { Router } from 'express'
const routes = Router()

import DepartmentController from '../controller/department.controller.js'
const departmentController = new DepartmentController()

routes.post(`/create`, departmentController.create())

routes.get(`/find`, departmentController.find())

routes.get(`/list`, departmentController.list())

routes.delete(`/delete`, departmentController.delete())

export default routes
