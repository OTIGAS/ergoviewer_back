import { Router } from 'express'
const routes = Router()

import AddressController from '../controller/address.controller.js'
const addressController = new AddressController()

routes.post(`/create`, addressController.create())

routes.get(`/find`, addressController.find())

routes.get(`/list`, addressController.list())

routes.put(`/update`, addressController.update())

routes.delete(`/delete`, addressController.delete())

export default routes
