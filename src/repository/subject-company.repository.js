import { db } from '../config/database.js'

import { UtilCheckHash, UtilGenerateHash } from '../utils/cryptography.js'

export default class SubjectCompanyRepository {
  async create({ company, user }) {
    try {
      const conn = await db()
      await conn.beginTransactionAsync()

      const subjectCompanyInsertResult = await conn.queryAsync(
        `
          INSERT INTO subject_company (name_subject, cnpj_subject, more_information)
          VALUES (?, ?, ?)
        `,
        [company?.name_subject, company?.cnpj_subject, company?.more_information]
      )

      if (subjectCompanyInsertResult.affectedRows === 0) {
        await conn.rollbackAsync()
        return { erro: `failureCompanyInsertion` }
      }

      const userInsertResult = await conn.queryAsync(
        `
          INSERT INTO user (id_subject, email_login, password_login, user_role, birth_date, registration_number)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          subjectCompanyInsertResult.insertId,
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

  async find(id_subject) {
    try {
      const conn = await db()
      return await conn.queryAsync(
        `
          SELECT 
            ac.id_subject, ac.name_subject, ac.cnpj_subject, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            subject_company ac
          LEFT JOIN
            contact c ON c.id_subject = ac.id_subject
            address a ON a.id_subject = ac.id_subject
          WHERE
            ac.id_subject = ? AND ac.deleted_at IS NULL
        `,
        [id_subject]
      )
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list({ name_subject, cnpj_subject, city }) {
    try {
      const conn = await db()
      return await conn.queryAsync(
        `
          SELECT 
            ac.id_subject, ac.name_subject, ac.cnpj_subject, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            subject_company ac
          LEFT JOIN
            contact c ON c.id_subject = ac.id_subject
            address a ON a.id_subject = ac.id_subject
          WHERE
            ac.name_subject LIKE ? AND ac.cnpj_subject LIKE ? AND a.city LIKE ? AND ac.deleted_at IS NULL
        `,
        [name_subject || '', cnpj_subject || '', city || '']
      )
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(id_subject, { name_subject, cnpj_subject, more_information }) {
    try {
      const conn = await db()
      const subjectCompanyUpdateResult = await conn.queryAsync(
        `
          UPDATE 
            subject_company
          SET
            name_subject = ?,
            cnpj_subject = ?,
            more_information = ?
          WHERE
            id_subject = ?
        `,
        [name_subject, cnpj_subject, more_information, id_subject]
      )

      if (subjectCompanyUpdateResult.affectedRows === 0) {
        return { erro: `failureCompanyUpdate` }
      }

      return { mensagem: `successCompanyUpdate` }
    } catch (error) {
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_subject) {
    try {
      const conn = await db()
      const subjectCompanyUpdateResult = await conn.queryAsync(
        `
          UPDATE 
            subject_company
          SET
            deleted_at = now()
          WHERE
            id_subject = ?
        `,
        [id_subject]
      )

      if (subjectCompanyUpdateResult.affectedRows === 0) {
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
