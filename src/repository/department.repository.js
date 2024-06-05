import { db } from '../config/database.js'

export default class DepartmentRepository {
  async create(id_project, department_name) {
    let conn
    try {
      conn = await db()

      const [departmentInsertResult] = await conn.query(
        `
          INSERT INTO department (id_project, department_name)
          VALUES (?, ?)
        `,
        [id_project, department_name]
      )

      if (departmentInsertResult.affectedRows === 0) {
        return { error: `failureDepartmentInsertion` }
      }

      return { message: `successDepartmentInsertion` }
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

  async find(id_department) {
    let conn
    try {
      conn = await db()
      const [departmentSelectResult] = await conn.query(
        `
          SELECT 
            d.id_department, 
            d.id_project, 
            d.department_name
          FROM
            department d
          WHERE
            d.id_department = ? AND d.deleted_at IS NULL
        `,
        [id_department]
      )

      return departmentSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list(id_project) {
    let conn
    try {
      conn = await db()

      const [departmentSelectResult] = await conn.query(
        `
          SELECT 
            d.id_department,
            d.id_project, 
            d.department_name
          FROM
            department d
          WHERE
            d.id_project = ? AND d.deleted_at IS NULL
        `,
        [id_project]
      )

      return departmentSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_department) {
    let conn
    try {
      conn = await db()
      const departmentUpdateResult = await conn.query(
        `
          UPDATE 
            department
          SET
            deleted_at = now()
          WHERE
            id_department = ?
        `,
        [id_department]
      )

      if (departmentUpdateResult.affectedRows === 0) {
        return { error: `failureDepartmentDeletion` }
      }

      return { message: `successDepartmentDeletion` }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
