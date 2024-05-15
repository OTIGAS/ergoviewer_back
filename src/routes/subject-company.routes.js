import { Router } from 'express'
const routes = Router()

import SubjectCompanyController from '../controller/subject-company.controller.js'
const subjectCompanyController = new SubjectCompanyController()

routes.post(`/create`, subjectCompanyController.create())

routes.get(`/find`, subjectCompanyController.find())

routes.get(`/list`, subjectCompanyController.list())

routes.put(`/update`, subjectCompanyController.update())

routes.delete(`/delete`, subjectCompanyController.delete())

export default routes
