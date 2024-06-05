import UserRepository from '../repository/user.repository.js'
const userRepository = new UserRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class UserController {
  create() {
    return async (req, res) => {
      try {
        const { user } = req.body

        if (
          !user?.id_company ||
          !user?.email_login ||
          !user?.user_role ||
          !user?.user_name ||
          !user?.birth_date ||
          !user?.registration_number
        ) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.create(user)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  login() {
    return async (req, res) => {
      try {
        const { cnpj, email, password } = req.body

        if (!cnpj || !email) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.login({ cnpj, email, password })
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  token() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.user

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.find(id_user)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  find() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.query

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.find(id_user)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  list() {
    return async (req, res) => {
      try {
        const { id_company, user_role, user_name } = req.query

        const response = await userRepository.list({
          id_company: id_company || '',
          user_role: user_role || '',
          user_name: user_name || '',
        })
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  avatarUser() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.user

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (!req.file) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const fileName = req.file.filename

        const response = await userRepository.avatarUser(id_user, fileName)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  firstAccess() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.user

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { new_password } = req.body

        if (!new_password) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.firstAccess(id_user, new_password)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  redefinePassword() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.user

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { new_password, old_password } = req.body

        if (!new_password || !old_password) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.redefinePassword(id_user, new_password, old_password)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  update() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.query

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { user } = req.body

        if (!user?.email_login || !user?.user_name || !user?.birth_date || !user?.registration_number) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.update(id_user, user)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  delete() {
    return async (req, res) => {
      try {
        const { id: id_user } = req.query

        if (!id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await userRepository.delete(id_user)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }
}
