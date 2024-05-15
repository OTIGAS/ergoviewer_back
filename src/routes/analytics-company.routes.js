import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import AnalyticsCompanyController from '../controller/analytics-company.controller.js'
const analyticsCompanyController = new AnalyticsCompanyController()

routes.post(`/cadastrar`, analyticsCompanyController.create())

routes.get(`/buscar`, analyticsCompanyController.find())

routes.get(`/listar`, analyticsCompanyController.list())

routes.put(`/atualizar`, analyticsCompanyController.update())

routes.delete(`/apagar`, analyticsCompanyController.delete())

export default routes
