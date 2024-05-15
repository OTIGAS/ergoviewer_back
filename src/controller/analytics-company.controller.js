import AnalyticsCompanyRepository from '../repository/analytics-company.repository.js'
const analyticsCompanyRepository = new AnalyticsCompanyRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class UsuarioController {
  create() {
    return async (req, res) => {
      const { company, user } = req.body

      if (!company?.name_analytics || !company?.cnpj_analytics || !company?.more_information) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      if (
        user?.email_login ||
        user?.password_login ||
        user?.user_role ||
        user?.birth_date ||
        user?.registration_number
      ) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await analyticsCompanyRepository.create({ company, user })
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
        const response = await analyticsCompanyRepository.list({ name_analytics, cnpj_analytics, more_information })
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

      const { body } = req.body

      if (!body?.name_analytics || !body?.cnpj_analytics || !body?.more_information) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await analyticsCompanyRepository.update(id_analytics, body)
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

      if (!id_usuario) {
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
