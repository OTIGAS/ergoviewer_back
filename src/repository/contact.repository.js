import { db } from '../config/database.js'
import { UtilGenerateHash, UtilGenerateToken } from '../utils/cryptography.js'

export default class ContactRepository {
  async create({ id_analytics, contact }) {
    let conn
    try {
      conn = await db()

      const [contactInsertResult] = await conn.query(
        `
          INSERT INTO contact (id_analytics, person_name, email, phone)
          VALUES (?, ?, ?, ?)
        `,
        [id_analytics, contact?.person_name, contact?.email, contact?.phone]
      )

      if (contactInsertResult.affectedRows === 0) {
        return { erro: `failureContactInsertion` }
      }

      return { mensagem: `welcomeMessage`, token }
    } catch (error) {
      console.error(error)

      if (error?.message?.includes(`Data too long`)) {
        return { erro: `errorInformationTooManyCharacters` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async find({ id_analytics, id_contact }) {
    let conn
    try {
      conn = await db()
      const [contactSelectResult] = await conn.query(
        `
          SELECT 
            c.id_contact, c.person_name, c.email, c.phone
          FROM
            contact c
          WHERE
            c.id_analytics = ? AND c.id_contact = ?
        `,
        [id_analytics, id_contact]
      )

      return contactSelectResult.map((result) => {
        return {
          id_contact: result.id_contact,
          person_name: result.person_name,
          email: result.email,
          phone: result.phone,
        }
      })
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list({ name_analytics, cnpj_analytics, city }) {
    let conn
    try {
      conn = await db()
      const [contactSelectResult] = await conn.query(
        `
          SELECT 
            c.id_contact, c.person_name, c.email, c.phone,
          FROM
            contact c
          WHERE
            c.id_analytics = ? AND c.id_contact = ?
        `,
        [`%${name_analytics}%`, `${cnpj_analytics}`, `${city}`]
      )

      return contactSelectResult.map((result) => {
        return {
          analytics_company: {
            id_analytics: result.id_analytics,
            name_analytics: result.name_analytics,
            cnpj_analytics: result.cnpj_analytics,
            more_information: result.more_information,
          },
          contact: {
            id_contact: result.id_contact,
            person_name: result.person_name,
            email: result.email,
            phone: result.phone,
          },
          address: {
            id_address: result.id_address,
            number: result.number,
            street: result.street,
            district: result.district,
            city: result.city,
            state: result.state,
            postal_code: result.postal_code,
            complement: result.complement,
          },
        }
      })
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(id_analytics, { name_analytics, cnpj_analytics, more_information }) {
    let conn
    try {
      conn = await db()
      const contactUpdateResult = await conn.query(
        `
          UPDATE 
            analytics_company
          SET
            name_analytics = ?,
            cnpj_analytics = ?,
            more_information = ?
          WHERE
            id_analytics = ?
        `,
        [name_analytics, cnpj_analytics, more_information, id_analytics]
      )

      if (contactUpdateResult.affectedRows === 0) {
        return { erro: `failureCompanyUpdate` }
      }

      return { mensagem: `successCompanyUpdate` }
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_analytics) {
    let conn
    try {
      conn = await db()
      const contactUpdateResult = await conn.query(
        `
          UPDATE 
            analytics_company
          SET
            deleted_at = now()
          WHERE
            id_analytics = ?
        `,
        [id_analytics]
      )

      if (contactUpdateResult.affectedRows === 0) {
        return { erro: `failureCompanyDeletion` }
      }

      return { mensagem: `successCompanyDeletion` }
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
