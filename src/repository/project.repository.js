import { db } from '../config/database.js'

export default class ProjectRepository {
  async create(project, departments) {
    let conn
    try {
      conn = await db()
      await conn.beginTransaction()

      const [projectInsertResult] = await conn.query(
        `
          INSERT INTO project (
            id_company_user, 
            id_user_contact, 
            id_user_address,
            id_company_customer, 
            id_customer_contact, 
            id_customer_address, 
            name_project, 
            description
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          project?.id_company_user,
          project?.id_user_contact,
          project?.id_user_address,
          project?.id_company_customer,
          project?.id_customer_contact,
          project?.id_customer_address,
          project?.name_project,
          project?.description,
        ]
      )

      if (projectInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const id_project = projectInsertResult.insertId

      if (departments) {
        const departmentInsertResults = await Promise.all(
          departments.map(async (department) => {
            const [departmentInsertResult] = await conn.query(
              `
                INSERT INTO department (id_project, department_name)
                VALUES (?, ?)
              `,
              [id_project, department.department_name]
            )
            return departmentInsertResult
          })
        )

        const failedDepartmentInsertions = departmentInsertResults.some((result) => result.affectedRows === 0)

        if (failedDepartmentInsertions) {
          await conn.rollback()
          return { error: `errorRegistration` }
        }
      }

      await conn.commit()

      return { message: `successfulRegistration` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async find(id_project) {
    let conn
    try {
      conn = await db()
      const [projectSelectResult] = await conn.query(
        `
        SELECT
          p.id_company_user,
          companyu.name_company AS user_name_company,
          p.id_user_contact, 
          contactu.person_name AS user_contact_person_name,
          p.id_user_address,
          addressu.city AS user_address_city,

          p.id_company_customer,
          companyc.name_company AS customer_name_company,
          p.id_customer_contact, 
          contactc.person_name AS customer_contact_person_name,
          p.id_customer_address,
          addressc.city AS customer_address_city,

          p.name_project,
          p.description,
          p.created_at,
          p.updated_at
        FROM
          project p
        LEFT JOIN
          company companyu ON companyu.id_company = p.id_company_user
        LEFT JOIN
          contact contactu ON contactu.id_contact = p.id_user_contact
        LEFT JOIN
          address addressu ON addressu.id_address = p.id_user_address
        LEFT JOIN
          company companyc ON companyc.id_company = p.id_company_customer
        LEFT JOIN
          contact contactc ON contactc.id_contact = p.id_customer_contact
        LEFT JOIN
          address addressc ON addressc.id_address = p.id_customer_address
        WHERE
          p.id_project = ? AND p.deleted_at IS NULL;
      
        `,
        [id_project]
      )

      return projectSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list(id_company_customer, id_company_user) {
    let conn
    try {
      conn = await db()

      const [projectSelectResult] = await conn.query(
        `
          SELECT
            p.id_company_user,
            companyu.name_company AS user_company_name,
            p.id_user_contact, 
            contactu.person_name AS user_contact_name,
            p.id_user_address,
            addressu.city AS user_address_city,

            p.id_company_customer,
            companyc.name_company AS customer_company_name,
            p.id_customer_contact, 
            contactc.person_name AS customer_contact_name,
            p.id_customer_address,
            addressc.city AS customer_address_city,
            
            p.id_project,
            p.name_project,
            p.description,
            p.created_at,
            p.updated_at
          FROM
            project p
          LEFT JOIN
            company companyu ON companyu.id_company = p.id_company_user
          LEFT JOIN
            contact contactu ON contactu.id_contact = p.id_user_contact
          LEFT JOIN
            address addressu ON addressu.id_address = p.id_user_address
          LEFT JOIN
            company companyc ON companyc.id_company = p.id_company_customer
          LEFT JOIN
            contact contactc ON contactc.id_contact = p.id_customer_contact
          LEFT JOIN
            address addressc ON addressc.id_address = p.id_customer_address
          WHERE
            (p.id_company_customer = ? OR p.id_company_user = ?) AND p.deleted_at IS NULL
        `,
        [id_company_customer, id_company_user]
      )

      return projectSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async update(project) {
    let conn
    try {
      conn = await db()
      const projectUpdateResult = await conn.query(
        `
          UPDATE 
            project
          SET
            id_customer_contact = ?,
            id_customer_address = ?,
            name_project = ?,
            description = ?
          WHERE
            id_project = ?
        `,
        [
          project?.id_customer_contact,
          project?.id_customer_address,
          project?.id_user_contact,
          project?.id_user_address,
          project?.name_project,
          project?.description,
          project?.id_project,
        ]
      )

      if (projectUpdateResult.affectedRows === 0) {
        return { error: `errorUpdate` }
      }

      return { message: `successfulUpdate` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_project) {
    let conn
    try {
      conn = await db()
      const projectUpdateResult = await conn.query(
        `
          UPDATE 
            project
          SET
            deleted_at = now()
          WHERE
            id_project = ?
        `,
        [id_project]
      )

      if (projectUpdateResult.affectedRows === 0) {
        return { error: `errorDelete` }
      }

      return { message: `successfulDelete` }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
