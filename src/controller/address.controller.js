import AddressRepository from '../repository/address.repository.js'
const addressRepository = new AddressRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class AdressController {
  create() {
    return async (req, res) => {
      try {
        const { id_company } = req.query

        if (!id_company) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { address } = req.body

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

        const response = await addressRepository.create(id_company, address)
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
        const { id: id_address } = req.query

        if (!id_address) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await addressRepository.find(id_address)
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
        const { id_company } = req.query

        const response = await addressRepository.list(id_company)
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
        const { id: id_address } = req.query

        if (!id_address) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { address } = req.body

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

        const response = await addressRepository.update(id_address, address)
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
        const { id: id_address } = req.query

        if (!id_address) {
          const response = { error: 'Parâmetros ausentes.' }
          return ResponseError(400, res, req, response)
        }

        const response = await addressRepository.delete(id_address)
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
