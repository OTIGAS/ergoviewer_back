import CompanyRepository from '../repository/company.repository.js'
const companyRepository = new CompanyRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class CompanyController {
  create() {
    return async (req, res) => {
      try {
        const { company, user, contact, address } = req.body

        if (!company?.type_company || !company?.name_company || !company?.cnpj_company || !company?.more_information) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (
          !user?.email_login ||
          !user?.password_login ||
          !user?.user_name ||
          !user?.birth_date ||
          !user?.registration_number
        ) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (!contact?.person_name || !contact?.email || !contact?.phone) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (
          !address?.number ||
          !address?.street ||
          !address?.district ||
          !address?.city ||
          !address?.state ||
          !address?.postal_code
        ) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await companyRepository.create({ company, user, contact, address })
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
        const { id: id_company } = req.query

        if (!id_company) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await companyRepository.find(id_company)
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
        const { name_company, cnpj_company, city } = req.query

        const response = await companyRepository.list({
          name_company: name_company || '',
          cnpj_company: cnpj_company || '',
          city: city || '',
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

  update() {
    return async (req, res) => {
      try {
        const { id: id_company } = req.query

        if (!id_company) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const company = req.body

        if (!company?.name_company || !company?.cnpj_company || !company?.more_information) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await companyRepository.update(id_company, company)
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
        const { id: id_company } = req.query

        if (!id_company) {
          const response = { error: 'Parâmetros ausentes.' }
          return ResponseError(400, res, req, response)
        }

        const response = await companyRepository.delete(id_company)
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
