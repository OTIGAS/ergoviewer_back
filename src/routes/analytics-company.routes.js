import { Router } from 'express'
const routes = Router()

import AnalyticsCompanyController from '../controller/analytics-company.controller.js'
const analyticsCompanyController = new AnalyticsCompanyController()

routes.post(`/create`, analyticsCompanyController.create())

routes.get(`/find`, analyticsCompanyController.find())

routes.get(`/list`, analyticsCompanyController.list())

routes.put(`/update`, analyticsCompanyController.update())

routes.delete(`/delete`, analyticsCompanyController.delete())

export default routes
