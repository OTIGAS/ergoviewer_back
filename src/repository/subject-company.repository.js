import { db } from '../config/database.js'
import { UtilGenerateHash, UtilGenerateToken } from '../utils/cryptography.js'

export default class SubjectCompanyRepository {
  async create({ company, user, contact, address }) {
    let conn
    try {
      conn = await db()
      await conn.beginTransaction()

      const [subjectCompanyInsertResult] = await conn.query(
        `
          INSERT INTO subject_company (name_subject, cnpj_subject, more_information)
          VALUES (?, ?, ?)
        `,
        [company?.name_subject, company?.cnpj_subject, company?.more_information]
      )

      if (subjectCompanyInsertResult.affectedRows === 0) {
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
          INSERT INTO user (id_subject, email_login, password_login, user_role, birth_date, registration_number)
          VALUES (?, ?, ?, 1, ?, ?)
        `,
        [
          subjectCompanyInsertResult?.insertId,
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
          INSERT INTO contact (id_subject, person_name, email, phone)
          VALUES (?, ?, ?, ?)
        `,
        [subjectCompanyInsertResult?.insertId, contact?.person_name, contact?.email, contact?.phone]
      )

      if (contactInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { erro: `failureContactInsertion` }
      }

      const [addressInsertResult] = await conn.query(
        `
          INSERT INTO address (id_subject, number, street, district, city, state, postal_code, complement)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          subjectCompanyInsertResult?.insertId,
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

  async find(id_subject) {
    let conn
    try {
      conn = await db()
      const [subjectCompanySelectResult] = await conn.query(
        `
          SELECT 
            ac.id_subject, ac.name_subject, ac.cnpj_subject, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            subject_company ac
          LEFT JOIN
            contact c ON c.id_subject = ac.id_subject
          LEFT JOIN
            address a ON a.id_subject = ac.id_subject
          WHERE
            ac.id_subject = ? AND ac.deleted_at IS NULL
        `,
        [id_subject]
      )

      return subjectCompanySelectResult.map((result) => {
        return {
          subject_company: {
            id_subject: result.id_subject,
            name_subject: result.name_subject,
            cnpj_subject: result.cnpj_subject,
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

  async list({ name_subject, cnpj_subject, city }) {
    let conn
    try {
      conn = await db()
      const [subjectCompanySelectResult] = await conn.query(
        `
          SELECT 
            ac.id_subject, ac.name_subject, ac.cnpj_subject, ac.more_information,
            c.id_contact, c.person_name, c.email, c.phone,
            a.id_address, a.number, a.street, a.district, a.city, a.state, a.postal_code, a.complement
          FROM
            subject_company ac
          LEFT JOIN
            contact c ON c.id_subject = ac.id_subject
          LEFT JOIN
            address a ON a.id_subject = ac.id_subject
          WHERE
            (ac.name_subject LIKE ? OR ac.cnpj_subject LIKE ? OR a.city LIKE ?) AND ac.deleted_at IS NULL
        `,
        [`%${name_subject}%`, `${cnpj_subject}`, `${city}`]
      )

      return subjectCompanySelectResult.map((result) => {
        return {
          subject_company: {
            id_subject: result.id_subject,
            name_subject: result.name_subject,
            cnpj_subject: result.cnpj_subject,
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

  async update(id_subject, { name_subject, cnpj_subject, more_information }) {
    let conn
    try {
      conn = await db()
      const subjectCompanyUpdateResult = await conn.query(
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
    let conn
    try {
      conn = await db()
      const subjectCompanyUpdateResult = await conn.query(
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
