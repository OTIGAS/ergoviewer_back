import SubjectCompanyRepository from '../repository/subject-company.repository.js'
const subjectCompanyRepository = new SubjectCompanyRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class SubjectCompanyController {
  create() {
    return async (req, res) => {
      const { company, user } = req.body

      if (!company?.name_subject || !company?.cnpj_subject || !company?.more_information) {
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
        const response = await subjectCompanyRepository.create({ company, user })
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
      const { id: id_subject_company } = req.query

      if (!id_subject_company) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await subjectCompanyRepository.find(id_subject_company)
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
      const { name_subject, cnpj_subject, more_information } = req.query

      try {
        const response = await subjectCompanyRepository.list({ name_subject, cnpj_subject, more_information })
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
      const { id: id_subject } = req.query

      if (!id_subject) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      const { body } = req.body

      if (!body?.name_subject || !body?.cnpj_subject || !body?.more_information) {
        const response = { erro: 'missingParameters' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await subjectCompanyRepository.update(id_subject, body)
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
      const { id: id_subject } = req.query

      if (!id_subject) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      try {
        const response = await subjectCompanyRepository.delete(id_subject)
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
