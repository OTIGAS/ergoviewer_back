import ProjectRepository from '../repository/project.repository.js'
const projectRepository = new ProjectRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class ProjectController {
  create() {
    return async (req, res) => {
      try {
        const { project } = req.body
        console.log(project)

        if (
          !project?.id_company_user ||
          !project?.id_user_contact ||
          !project?.id_user_address ||
          !project?.id_company_customer ||
          !project?.id_customer_contact ||
          !project?.id_customer_address ||
          !project?.name_project ||
          !project?.description
        ) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await projectRepository.create(project)
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

  find() {
    return async (req, res) => {
      try {
        const { id: id_project } = req.query

        if (!id_project) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await projectRepository.find(id_project)
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
        const { id_company_customer, id_company_user } = req.query

        if (!id_company_customer && !id_company_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await projectRepository.list(id_company_customer, id_company_user)
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
        const { id: id_project } = req.query

        if (!id_project) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { project } = req.body

        if (
          !project?.id_project ||
          !project?.id_company_customer ||
          !project?.id_customer_contact ||
          !project?.id_customer_address ||
          !project?.id_company_user ||
          !project?.id_user_contact ||
          !project?.id_user_address ||
          !project?.name_project ||
          !project?.description
        ) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await projectRepository.update(id_project, project)
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
        const { id: id_project } = req.query

        if (!id_project) {
          const response = { error: 'Parâmetros ausentes.' }
          return ResponseError(400, res, req, response)
        }

        const response = await projectRepository.delete(id_project)
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
