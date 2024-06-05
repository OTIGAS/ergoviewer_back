import { db } from '../config/database.js'

export default class ContactRepository {
  async create(id_company, contact) {
    let conn
    try {
      conn = await db()

      const [contactInsertResult] = await conn.query(
        `
          INSERT INTO contact (id_company, person_name, email, phone)
          VALUES (?, ?, ?, ?)
        `,
        [id_company, contact?.person_name, contact?.email, contact?.phone]
      )

      if (contactInsertResult.affectedRows === 0) {
        return { error: `failureContactInsertion` }
      }

      return { message: `successContactInsertion` }
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

  async find(id_contact) {
    let conn
    try {
      conn = await db()
      const [contactSelectResult] = await conn.query(
        `
          SELECT 
            c.id_contact, c.person_name, c.email, c.phone, c.id_company
          FROM
            contact c
          WHERE
            c.id_contact = ? AND c.deleted_at IS NULL
        `,
        [id_contact]
      )

      return contactSelectResult
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

      const [contactSelectResult] = await conn.query(
        `
          SELECT 
            c.id_contact, c.person_name, c.email, c.phone, c.id_company
          FROM
            contact c
          WHERE
            c.id_company = ? AND c.deleted_at IS NULL
        `,
        [id_company]
      )

      return contactSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(id_contact, { person_name, email, phone }) {
    let conn
    try {
      conn = await db()
      const contactUpdateResult = await conn.query(
        `
          UPDATE 
            contact
          SET
            person_name = ?,
            email = ?,
            phone = ?
          WHERE
            id_contact = ?
        `,
        [person_name, email, phone, id_contact]
      )

      if (contactUpdateResult.affectedRows === 0) {
        return { error: `failureContactUpdate` }
      }

      return { message: `successContactUpdate` }
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

  async delete(id_contact) {
    let conn
    try {
      conn = await db()
      const contactUpdateResult = await conn.query(
        `
          UPDATE 
            contact
          SET
            deleted_at = now()
          WHERE
            id_contact = ?
        `,
        [id_contact]
      )

      if (contactUpdateResult.affectedRows === 0) {
        return { error: `failureContactDeletion` }
      }

      return { message: `successContactDeletion` }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
