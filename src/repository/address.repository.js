import { db } from '../config/database.js'

export default class AddressRepository {
  async create(id_company, address) {
    let conn
    try {
      conn = await db()

      const [addressInsertResult] = await conn.query(
        `
          INSERT INTO address (
            id_company, 
            number, 
            street, 
            district, 
            city, 
            state, 
            postal_code, 
            complement
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id_company,
          address?.number,
          address?.street,
          address?.district,
          address?.city,
          address?.state,
          address?.postal_code,
          address?.complement,
        ]
      )

      if (addressInsertResult.affectedRows == 0) {
        return { error: `failureAddressInsertion` }
      }

      return { message: `successAddressInsertion` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Data too long`)) {
        return { error: `errorInformationTooManyCharacters` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async find(id_address) {
    let conn
    try {
      conn = await db()
      const [addressSelectResult] = await conn.query(
        `
          SELECT
            a.id_address, 
            a.number, 
            a.street, 
            a.district, 
            a.city, 
            a.state, 
            a.postal_code, 
            a.complement
          FROM
            address a
          WHERE
            a.id_address = ? AND a.deleted_at IS NULL
        `,
        [id_address]
      )

      return addressSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list(id_company) {
    let conn
    try {
      conn = await db()

      const [addressSelectResult] = await conn.query(
        `
          SELECT
            a.id_address, 
            a.number, 
            a.street, 
            a.district, 
            a.city, 
            a.state, 
            a.postal_code, 
            a.complement
          FROM
            address a
          WHERE
            a.id_company = ? AND a.deleted_at IS NULL
        `,
        [id_company]
      )

      return addressSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(id_address, address) {
    let conn
    try {
      conn = await db()
      const addressUpdateResult = await conn.query(
        `
          UPDATE 
            address
          SET
            number = ?,
            street = ?,
            district = ?,
            city = ?,
            state = ?,
            postal_code = ?,
            complement = ?
          WHERE
            id_address = ?
        `,
        [
          address?.number,
          address?.street,
          address?.district,
          address?.city,
          address?.state,
          address?.postal_code,
          address?.complement,
          id_address,
        ]
      )

      if (addressUpdateResult.affectedRows === 0) {
        return { error: `failureAddressUpdate` }
      }

      return { message: `successAddressUpdate` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Data too long`)) {
        return { error: `errorInformationTooManyCharacters` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_address) {
    let conn
    try {
      conn = await db()
      const addressUpdateResult = await conn.query(
        `
          UPDATE 
            address
          SET
            deleted_at = now()
          WHERE
            id_address = ?
        `,
        [id_address]
      )

      if (addressUpdateResult.affectedRows === 0) {
        return { error: `failureAddressDeletion` }
      }

      return { message: `successAddressDeletion` }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
