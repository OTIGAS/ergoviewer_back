import { db } from '../config/database.js'
import { UtilGenerateHash, UtilGenerateToken } from '../utils/cryptography.js'

export default class AnalyticsCompanyRepository {
  async create({ company, user, contact, address }) {
    let conn
    try {
      conn = await db()
      await conn.beginTransaction()

      const [analyticsCompanyInsertResult] = await conn.query(
        `
          INSERT INTO analytics_company (name_analytics, cnpj_analytics, more_information)
          VALUES (?, ?, ?)
        `,
        [company?.name_analytics, company?.cnpj_analytics, company?.more_information]
      )

      if (analyticsCompanyInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { erro: `failureCompanyInsertion` }
      }

      const hashPasswordResult = await UtilGenerateHash(user?.password_login)

      if (!hashPasswordResult) {
        await conn.rollback()
        return { erro: `failureUserInsertion` }
      }

      const [userInsertResult] = await conn.query(
        `
          INSERT INTO user (id_analytics, email_login, password_login, user_role, birth_date, registration_number)
          VALUES (?, ?, ?, 1, ?, ?)
        `,
        [
          analyticsCompanyInsertResult?.insertId,
          user?.email_login,
          hashPasswordResult,
          user?.birth_date,
          user?.registration_number,
        ]
      )

      if (userInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { erro: `failureUserInsertion` }
      }

      const [contactInsertResult] = await conn.query(
        `
          INSERT INTO contact (id_analytics, person_name, email, phone)
          VALUES (?, ?, ?, ?)
        `,
        [analyticsCompanyInsertResult?.insertId, contact?.person_name, contact?.email, contact?.phone]
      )

      if (contactInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { erro: `failureContactInsertion` }
      }

      const [addressInsertResult] = await conn.query(
        `
          INSERT INTO address (id_analytics, number, street, district, city, state, postal_code, complement)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          analyticsCompanyInsertResult?.insertId,
          address?.number,
          address?.street,
          address?.district,
          address?.city,
          address?.state,
          address?.postal_code,
          address?.complement,
        ]
      )

      if (addressInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { erro: `failureAddressInsertion` }
      }

      await conn.commit()

      const token = await UtilGenerateToken({ id: userInsertResult?.insertId, role: 1 })

      return { mensagem: `welcomeMessage`, token }
    } catch (error) {
      console.error(error)

      if (error?.message?.includes(`Duplicate`)) {
        return { erro: `errorDuplicateRegistration` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { erro: `errorInformationTooManyCharacters` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async find(id_analytics) {
    let conn
    try {
      conn = await db()
      const [analyticsCompanySelectResult] = await conn.query(
        `
          SELECT 
            ac.id_analytics, ac.name_analytics, ac.cnpj_analytics, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            analytics_company ac
          LEFT JOIN
            contact c ON c.id_analytics = ac.id_analytics
          LEFT JOIN
            address a ON a.id_analytics = ac.id_analytics
          WHERE
            ac.id_analytics = ? AND ac.deleted_at IS NULL
        `,
        [id_analytics]
      )

      return analyticsCompanySelectResult.map((result) => {
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

  async list({ name_analytics, cnpj_analytics, city }) {
    let conn
    try {
      conn = await db()
      const [analyticsCompanySelectResult] = await conn.query(
        `
          SELECT 
            ac.id_analytics, ac.name_analytics, ac.cnpj_analytics, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            analytics_company ac
          LEFT JOIN
            contact c ON c.id_analytics = ac.id_analytics
          LEFT JOIN
            address a ON a.id_analytics = ac.id_analytics
          WHERE
            (ac.name_analytics LIKE ? OR ac.cnpj_analytics LIKE ? OR a.city LIKE ?) AND ac.deleted_at IS NULL
        `,
        [`%${name_analytics}%`, `${cnpj_analytics}`, `${city}`]
      )

      return analyticsCompanySelectResult.map((result) => {
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
      const analyticsCompanyUpdateResult = await conn.query(
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

      if (analyticsCompanyUpdateResult.affectedRows === 0) {
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
      const analyticsCompanyUpdateResult = await conn.query(
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

      if (analyticsCompanyUpdateResult.affectedRows === 0) {
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
