import { db } from '../config/database.js'

export default class AnalysisRepository {
  async create(analysis) {
    let conn
    try {
      conn = await db()

      const [analysisInsertResult] = await conn.query(
        `
          INSERT INTO analysis (
            id_department, 
            id_user, 
            analysis_name, 
            analysis_image, 
            analysis_description
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [analysis?.id_department, analysis?.analysis_name, analysis?.analysis_image, analysis?.analysis_description]
      )

      if (analysisInsertResult.affectedRows === 0) {
        return { error: `errorRegistration` }
      }

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

  async find(id_analysis) {
    let conn
    try {
      conn = await db()
      const [analysisSelectResult] = await conn.query(
        `
          SELECT 
            a.id_analysis, 
            a.id_department,
            d.department_name,
            p.name_project,
            a.id_user, 
            u.user_name,
            u.user_role,
            a.analysis_name, 
            a.analysis_image, 
            a.analysis_description,
            a.created_at
          FROM
            analysis a
          LEFT JOIN
            department d ON d.id_department = a.id_department
          LEFT JOIN
            project p ON p.id_project = d.id_project
          LEFT JOIN 
            user u ON u.id_user = a.id_user
          WHERE
            a.id_analysis = ? AND a.deleted_at IS NULL
        `,
        [id_analysis]
      )

      return analysisSelectResult
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

      const [analysisSelectResult] = await conn.query(
        `
          SELECT 
            a.id_analysis, 
            a.id_department,
            d.department_name,
            p.name_project,
            a.id_user, 
            u.user_name,
            u.user_role,
            a.analysis_name, 
            a.analysis_image, 
            a.analysis_description,
            a.created_at
          FROM
            analysis a
          LEFT JOIN
            department d ON d.id_department = a.id_department
          LEFT JOIN
            project p ON p.id_project = d.id_project
          LEFT JOIN 
            user u ON u.id_user = a.id_user
          WHERE
            (d.id_department = ? OR u.id_user = ? OR p.id_project = ?)
        `,
        [id_department, id_user, id_project]
      )

      return analysisSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_analysis) {
    let conn
    try {
      conn = await db()
      const analysisUpdateResult = await conn.query(
        `
          UPDATE 
            analysis
          SET
            deleted_at = now()
          WHERE
            id_analysis = ?
        `,
        [id_analysis]
      )

      if (analysisUpdateResult.affectedRows === 0) {
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
