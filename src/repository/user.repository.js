import { db } from '../config/database.js'
import { UtilCheckHash, UtilGenerateHash, UtilGenerateToken } from '../util/cryptography.js'

import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default class UserRepository {
  async create(user) {
    let conn
    try {
      conn = await db()

      const [userInsertResult] = await conn.query(
        `
          INSERT INTO user (id_company, email_login, user_role, user_name, birth_date, registration_number)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          user?.id_company,
          user?.email_login,
          user?.user_role,
          user?.user_name,
          user?.birth_date,
          user?.registration_number,
        ]
      )

      console.log(userInsertResult)

      if (userInsertResult.affectedRows === 0) {
        return { error: `failureUserInsertion` }
      }

      return { message: `successUserInsertion` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplicateRegistration` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorInformationTooManyCharacters` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async login({ cnpj, email, password }) {
    let conn
    try {
      conn = await db()
      const [userSelectResult] = await conn.query(
        `
          SELECT
            u.id_user, 
            u.email_login, 
            u.password_login, 
            u.user_role, 
            u.avatar, 
            u.user_name, 
            u.birth_date, 
            u.registration_number, 
            u.id_company,
            c.type_company,
            c.name_company
          FROM
            user u
          LEFT JOIN
            company c ON u.id_company = c.id_company
          WHERE
            u.email_login LIKE ? AND u.deleted_at IS NULL
        `,
        [email]
      )

      if (userSelectResult.length === 0) {
        return { error: `invalidCNPJEmail` }
      }

      const [companySelectResult] = await conn.query(
        `
          SELECT 
            c.id_company, 
            c.name_company, 
            c.cnpj_company, 
            c.more_information
          FROM
            company c
          WHERE
            c.id_company = ? AND c.cnpj_company LIKE ? AND c.deleted_at IS NULL
        `,
        [userSelectResult[0].id_company, cnpj]
      )

      if (companySelectResult.length === 0) {
        return { error: `invalidCNPJEmail` }
      }

      const { password_login, ...user } = userSelectResult[0]

      if (!password_login) {
        const token = UtilGenerateToken(
          {
            id: user?.id_user,
            role: user?.user_role,
          },
          true
        )
        return { token, user, company: companySelectResult[0], first: true }
      }

      const passwordMatch = await UtilCheckHash(password, password_login)

      if (!passwordMatch) {
        return { error: `invalidPassword` }
      }

      const token = UtilGenerateToken({
        id: user.id_user,
        role: user.user_role,
        company: user.type_company,
      })

      return { token, user }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async find(id_user) {
    let conn
    try {
      conn = await db()
      const [userSelectResult] = await conn.query(
        `
          SELECT
            u.id_user, 
            u.email_login, 
            u.user_role, 
            u.avatar, 
            u.user_name, 
            u.birth_date, 
            u.registration_number, 
            u.id_company,
            c.type_company,
            c.name_company
          FROM
            user u
          LEFT JOIN
            company c ON u.id_company = c.id_company
          WHERE
            u.id_user = ? AND u.deleted_at IS NULL
        `,
        [id_user]
      )

      if (userSelectResult[0].length === 0) {
        return { error: `failureUserFetch` }
      }

      const { password_login, ...user } = userSelectResult[0]

      const token = UtilGenerateToken({
        id: user.id_user,
        role: user.user_role,
        company: user.type_company,
      })

      return { token, user }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list({ id_company, user_role, user_name }) {
    let conn
    try {
      conn = await db()
      const [userSelectResult] = await conn.query(
        `
          SELECT
            u.id_user, 
            u.email_login, 
            u.user_role, 
            u.avatar, 
            u.user_name, 
            u.birth_date, 
            u.registration_number
          FROM
            user u
          WHERE
            ( 
              u.user_role = ? OR 
              u.user_name LIKE ?
            ) AND u.id_company = ? 
            AND u.deleted_at IS NULL
        `,
        [user_role, `%${user_name}%`, id_company]
      )

      return userSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async avatarUser(id_user, fileName) {
    let conn
    try {
      conn = await db()
      const [userSelectResult] = await conn.query(
        `
          SELECT
            avatar
          FROM
            user
          WHERE
            id_user = ?
        `,
        [id_user]
      )

      if (userSelectResult[0].avatar) {
        const oldAvatar = userSelectResult[0].avatar

        if (oldAvatar) {
          const oldAvatarPath = path.join(__dirname, '../../avatars', oldAvatar)
          fs.unlink(oldAvatarPath, (err) => {
            if (err) console.error(`Error deleting old avatar: ${err.message}`)
          })
        }
      }

      const userUpdateResult = await conn.query(
        `
          UPDATE 
            user
          SET
            avatar = ?
          WHERE
            id_user = ?
        `,
        [fileName, id_user]
      )

      if (userUpdateResult[0].affectedRows === 0) {
        return { error: `failureUserUpdate` }
      }

      return { message: `successUserUpdate` }
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

  async firstAccess(id_user, new_password) {
    let conn
    try {
      conn = await db()
      const [userSelectResult] = await conn.query(
        `
          SELECT
            u.password_login
          FROM
            user u
          WHERE
            u.id_user = ? AND u.deleted_at IS NULL
        `,
        [id_user]
      )

      if (userSelectResult[0].length === 0) {
        return { error: `failureUserFetch` }
      }

      if (userSelectResult[0].password_login) {
        return { error: `userAlreadyHasPassword` }
      }

      const hashPasswordResult = await UtilGenerateHash(new_password)

      if (!hashPasswordResult) {
        return { error: `failureUserUpdate` }
      }

      const userUpdateResult = await conn.query(
        `
          UPDATE 
            user
          SET
            password_login = ?
          WHERE
            id_user = ?
        `,
        [hashPasswordResult, id_user]
      )

      if (userUpdateResult[0].affectedRows === 0) {
        return { error: `failureUserUpdate` }
      }

      return { message: `successUserUpdate` }
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

  async redefinePassword(id_user, new_password, old_password) {
    let conn
    try {
      conn = await db()
      const [userSelectResult] = await conn.query(
        `
          SELECT
            u.password_login
          FROM
            user u
          WHERE
            u.id_user = ? AND u.deleted_at IS NULL
        `,
        [id_user]
      )

      if (userSelectResult[0].length === 0) {
        return { error: `failureUserFetch` }
      }

      const passwordMatch = await UtilCheckHash(old_password, userSelectResult[0].password_login)

      if (!passwordMatch) {
        return { error: `invalidPassword` }
      }

      const hashPasswordResult = await UtilGenerateHash(new_password)

      if (!hashPasswordResult) {
        return { error: `failureUserUpdate` }
      }

      const userUpdateResult = await conn.query(
        `
          UPDATE 
            user
          SET
            password_login = ?
          WHERE
            id_user = ?
        `,
        [hashPasswordResult, id_user]
      )

      if (userUpdateResult[0].affectedRows === 0) {
        return { error: `failureUserUpdate` }
      }

      return { message: `successUserUpdate` }
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

  async update(id_user, user) {
    let conn
    try {
      conn = await db()
      const userUpdateResult = await conn.query(
        `
          UPDATE 
            user
          SET
            email_login = ?,
            user_name = ?,
            birth_date = ?,
            registration_number = ?
          WHERE
            id_user = ?
        `,
        [user?.email_login, user?.user_name, user?.birth_date, user?.registration_number, id_user]
      )

      if (userUpdateResult.affectedRows === 0) {
        return { error: `failureUserUpdate` }
      }

      return { message: `successUserUpdate` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplicateRegistration` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorInformationTooManyCharacters` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_user) {
    let conn
    try {
      conn = await db()
      const userUpdateResult = await conn.query(
        `
          UPDATE 
            user
          SET
            deleted_at = now()
          WHERE
            id_user = ?
        `,
        [id_user]
      )

      if (userUpdateResult.affectedRows === 0) {
        return { error: `failureUserDeletion` }
      }

      return { message: `successUserDeletion` }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
