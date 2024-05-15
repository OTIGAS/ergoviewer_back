import { db } from '../config/database.js'

import { UtilCheckHash, UtilGenerateHash } from '../utils/cryptography.js'

export default class AnalyticsCompanyRepository {
  async create({ company, user }) {
    try {
      const conn = await db()
      await conn.beginTransactionAsync()

      const analyticsCompanyInsertResult = await conn.queryAsync(
        `
          INSERT INTO analytics_company (name_analytics, cnpj_analytics, more_information)
          VALUES (?, ?, ?)
        `,
        [company?.name_analytics, company?.cnpj_analytics, company?.more_information]
      )

      if (analyticsCompanyInsertResult.affectedRows === 0) {
        await conn.rollbackAsync()
        return { erro: `failureCompanyInsertion` }
      }

      const userInsertResult = await conn.queryAsync(
        `
          INSERT INTO user (id_analytics, email_login, password_login, user_role, birth_date, registration_number)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          analyticsCompanyInsertResult.insertId,
          user?.email_login,
          user?.password_login,
          user?.user_role,
          user?.birth_date,
          user?.registration_number,
        ]
      )

      if (userInsertResult.affectedRows === 0) {
        await conn.rollbackAsync()
        return { erro: `failureUserInsertion` }
      }

      await conn.commitAsync()

      return { mensagem: `welcomeMessage` }
    } catch (error) {
      console.error(error)

      if (error?.message?.includes(`Duplicate`)) {
        return { erro: `errorDuplicateRegistration` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async find(id_analytics) {
    try {
      const conn = await db()
      return await conn.queryAsync(
        `
          SELECT 
            ac.id_analytics, ac.name_analytics, ac.cnpj_analytics, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            analytics_company ac
          LEFT JOIN
            contact c ON c.id_analytics = ac.id_analytics
            address a ON a.id_analytics = ac.id_analytics
          WHERE
            ac.id_analytics = ? AND ac.deleted_at IS NULL
        `,
        [id_analytics]
      )
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list({ name_analytics, cnpj_analytics, city }) {
    try {
      const conn = await db()
      return await conn.queryAsync(
        `
          SELECT 
            ac.id_analytics, ac.name_analytics, ac.cnpj_analytics, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            analytics_company ac
          LEFT JOIN
            contact c ON c.id_analytics = ac.id_analytics
            address a ON a.id_analytics = ac.id_analytics
          WHERE
            ac.name_analytics LIKE ? AND ac.cnpj_analytics LIKE ? AND a.city LIKE ? AND ac.deleted_at IS NULL
        `,
        [name_analytics || '', cnpj_analytics || '', city || '']
      )
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(id_analytics, { name_analytics, cnpj_analytics, more_information }) {
    try {
      const conn = await db()
      const analyticsCompanyUpdateResult = await conn.queryAsync(
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
    try {
      const conn = await db()
      const analyticsCompanyUpdateResult = await conn.queryAsync(
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
