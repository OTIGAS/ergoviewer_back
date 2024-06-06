import { db } from '../config/database.js'
import { UtilGenerateHash, UtilGenerateToken } from '../util/cryptography.js'

export default class CompanyRepository {
  async create({ company, user, contact, address }) {
    let conn
    try {
      conn = await db()
      await conn.beginTransaction()

      const mediator = company.id_mediator
        ? {
            insert: ', id_mediator',
            values: ', ?',
          }
        : {
            insert: '',
            values: '',
          }

      const [companyInsertResult] = await conn.query(
        `
          INSERT INTO company (type_company, name_company, cnpj_company, more_information ${mediator.insert})
          VALUES (?, ?, ?, ? ${mediator.values})
        `,
        [
          company?.type_company,
          company?.name_company,
          company?.cnpj_company,
          company?.more_information,
          company?.id_mediator ? company?.id_mediator : null,
        ]
      )

      if (companyInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const hashPasswordResult = await UtilGenerateHash(user?.password_login)

      if (!hashPasswordResult) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const [userInsertResult] = await conn.query(
        `
          INSERT INTO user (id_company, user_role, email_login, password_login, user_name, birth_date, registration_number)
          VALUES (?, 1, ?, ?, ?, ?, ?)
        `,
        [
          companyInsertResult?.insertId,
          user?.email_login,
          hashPasswordResult,
          user?.user_name,
          user?.birth_date,
          user?.registration_number,
        ]
      )

      if (userInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const [contactInsertResult] = await conn.query(
        `
          INSERT INTO contact (id_company, person_name, email, phone)
          VALUES (?, ?, ?, ?)
        `,
        [companyInsertResult?.insertId, contact?.person_name, contact?.email, contact?.phone]
      )

      if (contactInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const [addressInsertResult] = await conn.query(
        `
          INSERT INTO address (id_company, number, street, district, city, state, postal_code, complement)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          companyInsertResult?.insertId,
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
        return { error: `errorRegistration` }
      }

      await conn.commit()

      const token = UtilGenerateToken({ id: userInsertResult?.insertId, role: 1 })

      return { message: `welcomeMessage`, user, token }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async find(id_company) {
    let conn
    try {
      conn = await db()
      const [companySelectResult] = await conn.query(
        `
            SELECT 
                c.id_company, 
                c.id_mediator,
                c.type_company,
                c.name_company, 
                c.cnpj_company, 
                c.more_information, 
                c.created_at, 
                c.updated_at
            FROM
                company c
            WHERE
                c.id_company = ? 
                AND c.deleted_at IS NULL
            `,
        [id_company]
      )

      if (!companySelectResult || companySelectResult.length === 0) {
        return []
      }

      const mediatorSelectResultPromises = companySelectResult.map(async (company) => {
        const [mediators] = await conn.query(
          `
            SELECT 
                c.id_company, 
                c.type_company,
                c.name_company, 
                c.cnpj_company, 
                c.more_information, 
                c.created_at, 
                c.updated_at
            FROM
                company c
            WHERE
                c.id_mediator = ? AND c.deleted_at IS NULL
          `,
          [company.id_company]
        )
        return { id_company: company.id_company, mediators }
      })

      const contactSelectResultPromises = companySelectResult.map(async (company) => {
        const [contacts] = await conn.query(
          `
            SELECT
                c.id_contact, 
                c.person_name, 
                c.email, 
                c.phone
            FROM
                contact c
            WHERE
                c.id_company = ? AND deleted_at IS NULL
          `,
          [company.id_company]
        )
        return { id_company: company.id_company, contacts }
      })

      const addressSelectResultPromises = companySelectResult.map(async (company) => {
        const [addresses] = await conn.query(
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
                a.id_company = ? AND deleted_at IS NULL
          `,
          [company.id_company]
        )
        return { id_company: company.id_company, addresses }
      })

      const mediatorSelectResult = await Promise.all(mediatorSelectResultPromises)
      const contactSelectResult = await Promise.all(contactSelectResultPromises)
      const addressSelectResult = await Promise.all(addressSelectResultPromises)

      return companySelectResult.map((company) => {
        const companyMediators =
          mediatorSelectResult.length > 0
            ? mediatorSelectResult.find((result) => result.id_company === company.id_company)?.mediators || []
            : []
        const companyContacts =
          contactSelectResult.find((result) => result.id_company === company.id_company)?.contacts || []
        const companyAddresses =
          addressSelectResult.find((result) => result.id_company === company.id_company)?.addresses || []

        return {
          company: {
            id_company: company.id_company,
            type_company: company.type_company,
            name_company: company.name_company,
            cnpj_company: company.cnpj_company,
            more_information: company.more_information,
          },
          mediator: companyMediators.map((mediator) => ({
            id_company: mediator.id_company,
            type_company: mediator.type_company,
            name_company: mediator.name_company,
            cnpj_company: mediator.cnpj_company,
            more_information: mediator.more_information,
          })),
          contact: companyContacts.map((contact) => ({
            id_contact: contact.id_contact,
            person_name: contact.person_name,
            email: contact.email,
            phone: contact.phone,
          })),
          address: companyAddresses.map((address) => ({
            id_address: address.id_address,
            number: address.number,
            street: address.street,
            district: address.district,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            complement: address.complement,
          })),
        }
      })
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list({ name_company, cnpj_company, city }) {
    let conn
    try {
      conn = await db()
      const [companySelectResult] = await conn.query(
        `
          SELECT 
            c.id_company, 
            c.id_mediator,
            c.type_company,
            c.name_company, 
            c.cnpj_company, 
            c.more_information, 
            c.created_at, 
            c.updated_at
          FROM
            company c
          LEFT JOIN
            address a ON a.id_company = c.id_company AND a.deleted_at IS NULL
          WHERE
            (c.name_company LIKE ? OR c.cnpj_company LIKE ? OR a.city LIKE ?) 
            AND c.deleted_at IS NULL
        `,
        [`%${name_company}%`, `%${cnpj_company}%`, `%${city}%`]
      )

      if (!companySelectResult || companySelectResult.length === 0) {
        return []
      }

      const mediatorSelectResultPromises = companySelectResult.map(async (company) => {
        const [mediators] = await conn.query(
          `
                SELECT 
                    c.id_company, 
                    c.type_company,
                    c.name_company, 
                    c.cnpj_company, 
                    c.more_information, 
                    c.created_at, 
                    c.updated_at
                FROM
                    company c
                WHERE
                    c.id_mediator = ? AND c.deleted_at IS NULL
                `,
          [company.id_company]
        )
        return { id_company: company.id_company, mediators }
      })

      const contactSelectResultPromises = companySelectResult.map(async (company) => {
        const [contacts] = await conn.query(
          `
                SELECT
                    c.id_contact, 
                    c.person_name, 
                    c.email, 
                    c.phone
                FROM
                    contact c
                WHERE
                    c.id_company = ? AND deleted_at IS NULL
                `,
          [company.id_company]
        )
        return { id_company: company.id_company, contacts }
      })

      const addressSelectResultPromises = companySelectResult.map(async (company) => {
        const [addresses] = await conn.query(
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
                    a.id_company = ? AND deleted_at IS NULL
                `,
          [company.id_company]
        )
        return { id_company: company.id_company, addresses }
      })

      const mediatorSelectResult = await Promise.all(mediatorSelectResultPromises)
      const contactSelectResult = await Promise.all(contactSelectResultPromises)
      const addressSelectResult = await Promise.all(addressSelectResultPromises)

      return companySelectResult.map((company) => {
        const companyMediators =
          mediatorSelectResult.length > 0
            ? mediatorSelectResult.find((result) => result.id_company === company.id_company)?.mediators || []
            : []
        const companyContacts =
          contactSelectResult.find((result) => result.id_company === company.id_company)?.contacts || []
        const companyAddresses =
          addressSelectResult.find((result) => result.id_company === company.id_company)?.addresses || []

        return {
          company: {
            id_company: company.id_company,
            type_company: company.type_company,
            name_company: company.name_company,
            cnpj_company: company.cnpj_company,
            more_information: company.more_information,
          },
          mediator: companyMediators.map((mediator) => ({
            id_company: mediator.id_company,
            type_company: mediator.type_company,
            name_company: mediator.name_company,
            cnpj_company: mediator.cnpj_company,
            more_information: mediator.more_information,
          })),
          contact: companyContacts.map((contact) => ({
            id_contact: contact.id_contact,
            person_name: contact.person_name,
            email: contact.email,
            phone: contact.phone,
          })),
          address: companyAddresses.map((address) => ({
            id_address: address.id_address,
            number: address.number,
            street: address.street,
            district: address.district,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            complement: address.complement,
          })),
        }
      })
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(id_company, { name_company, cnpj_company, more_information }) {
    let conn
    try {
      conn = await db()
      const companyUpdateResult = await conn.query(
        `
          UPDATE 
            company
          SET
            name_company = ?,
            cnpj_company = ?,
            more_information = ?
          WHERE
            id_company = ?
        `,
        [name_company, cnpj_company, more_information, id_company]
      )

      if (companyUpdateResult.affectedRows === 0) {
        return { error: `errorUpdate` }
      }

      return { message: `successfulUpdate` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_company) {
    let conn
    try {
      conn = await db()
      const companyCompanyUpdateResult = await conn.query(
        `
          UPDATE 
            company
          SET
            deleted_at = now()
          WHERE
            id_company = ?
        `,
        [id_company]
      )

      if (companyCompanyUpdateResult.affectedRows === 0) {
        return { error: `errorDelete` }
      }

      return { message: `successfulDelete` }
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
