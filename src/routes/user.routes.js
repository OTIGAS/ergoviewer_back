import { Router } from 'express'
const routes = Router()

import { check_token } from '../middleware/authentication.js'

import UserController from '../controller/user.controller.js'
import { upload } from '../config/multer.js'
const userController = new UserController()

routes.post(`/create`, userController.create())

routes.post(`/login`, userController.login())

routes.get(`/token`, check_token, userController.token())

routes.get(`/find`, userController.find())

routes.get(`/list`, userController.list())

routes.patch('/avatar', check_token, upload.single('avatar'), userController.avatarUser())

routes.patch(`/first-access`, check_token, userController.firstAccess())

routes.patch(`/redefine-password`, check_token, userController.redefinePassword())

routes.put(`/update`, userController.update())

routes.delete(`/delete`, userController.delete())

export default routes
