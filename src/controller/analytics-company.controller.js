import AnalyticsCompanyRepository from '../repository/analytics-company.repository.js'
const analyticsCompanyRepository = new AnalyticsCompanyRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class AnalyticsCompanyController {
  create() {
    return async (req, res) => {
      const { company, user, contact, address } = req.body

      if (!company?.name_analytics || !company?.cnpj_analytics || !company?.more_information) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      if (!user?.email_login || !user?.password_login || !user?.birth_date || !user?.registration_number) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      if (!contact?.person_name || !contact?.email || !contact?.phone) {
        console.log('contact', contact)
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      if (
        !address?.number ||
        !address?.street ||
        !address?.district ||
        !address?.city ||
        !address?.state ||
        !address?.postal_code
      ) {
        console.log('address', address)
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await analyticsCompanyRepository.create({ company, user, contact, address })
        if (response.erro) {
          return RespostaErro(400, res, req, response)
        } else {
          return RespostaSucesso(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return RespostaFalha(500, res, req, null, error)
      }
    }
  }

  find() {
    return async (req, res) => {
      const { id: id_analytics_company } = req.query

      if (!id_analytics_company) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await analyticsCompanyRepository.find(id_analytics_company)
        if (response.erro) {
          return RespostaErro(400, res, req, response)
        } else {
          return RespostaSucesso(200, res, req, response)
        }
      } catch (error) {
        return RespostaFalha(500, res, req, null, error)
      }
    }
  }

  list() {
    return async (req, res) => {
      const { name_analytics, cnpj_analytics, more_information } = req.query

      try {
        const response = await analyticsCompanyRepository.list({
          name_analytics: name_analytics || '',
          cnpj_analytics: cnpj_analytics || '',
          more_information: more_information || '',
        })
        if (response.erro) {
          return RespostaErro(400, res, req, response)
        } else {
          return RespostaSucesso(200, res, req, response)
        }
      } catch (error) {
        return RespostaFalha(500, res, req, null, error)
      }
    }
  }

  update() {
    return async (req, res) => {
      const { id: id_analytics } = req.query

      if (!id_analytics) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      const company = req.body

      if (!company?.name_analytics || !company?.cnpj_analytics || !company?.more_information) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await analyticsCompanyRepository.update(id_analytics, company)
        if (response.erro) {
          return RespostaErro(400, res, req, response)
        } else {
          return RespostaSucesso(200, res, req, response)
        }
      } catch (error) {
        return RespostaFalha(500, res, req, null, error)
      }
    }
  }

  delete() {
    return async (req, res) => {
      const { id: id_analytics } = req.query

      if (!id_analytics) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await analyticsCompanyRepository.delete(id_analytics)
        if (response.erro) {
          return RespostaErro(400, res, req, response)
        } else {
          return RespostaSucesso(200, res, req, response)
        }
      } catch (error) {
        return RespostaFalha(500, res, req, null, error)
      }
    }
  }
}
