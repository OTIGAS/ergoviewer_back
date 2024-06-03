import ContactRepository from '../repository/contact.repository.js'
const contactRepository = new ContactRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class ContactController {
  create() {
    return async (req, res) => {
      try {
        const { id_company } = req.query

        if (!id_company) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { contact } = req.body

        if (!contact?.person_name || !contact?.email || !contact?.phone) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await contactRepository.create(id_company, contact)
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
      const { id: id_contact } = req.query

      if (!id_contact) {
        const response = { error: 'missingParameters' }
        return ResponseError(400, res, req, response)
      }

      try {
        const response = await contactRepository.find(id_contact)
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
      const { id_company } = req.query

      try {
        const response = await contactRepository.list(id_company)
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
      const { id: id_contact } = req.query

      if (!id_contact) {
        const response = { error: 'missingParameters' }
        return ResponseError(400, res, req, response)
      }

      const { contact } = req.body

      if (!contact?.person_name || !contact?.email || !contact?.phone) {
        const response = { error: 'missingParameters' }
        return ResponseError(400, res, req, response)
      }

      try {
        const response = await contactRepository.update(id_contact, contact)
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
      const { id: id_contact } = req.query

      if (!id_contact) {
        const response = { error: 'Parâmetros ausentes.' }
        return ResponseError(400, res, req, response)
      }

      try {
        const response = await contactRepository.delete(id_contact)
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
