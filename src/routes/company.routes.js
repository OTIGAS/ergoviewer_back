import { Router } from 'express'
const routes = Router()

import CompanyController from '../controller/company.controller.js'
const companyController = new CompanyController()

routes.post(`/create`, companyController.create())

routes.get(`/find`, companyController.find())

routes.get(`/list`, companyController.list())

routes.put(`/update`, companyController.update())

routes.delete(`/delete`, companyController.delete())

export default routes
