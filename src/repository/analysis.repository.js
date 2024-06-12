import { db } from '../config/database.js'

export default class AnalysisRepository {
  async create(analysis, niosh, owas, rula) {
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
        [
          analysis?.id_department,
          analysis?.id_user,
          analysis?.analysis_name,
          analysis?.analysis_image,
          analysis?.analysis_description,
        ]
      )

      if (analysisInsertResult.affectedRows === 0) {
        return { error: 'errorRegistration' }
      }

      const id_analysis = analysisInsertResult.insertId

      let methodInsertResult

      if (niosh) {
        methodInsertResult = await conn.query(
          `
            INSERT INTO ergoviewer.niosh_method (
              id_analysis, 
              lifted_item, 
              horizontal_distance, 
              vertical_distance, 
              vertical_displacement, 
              trunk_twist_angle, 
              average_lift_frequency, 
              grip_quality, 
              load_mass, 
              recommended_weight_limit, 
              lifting_index, 
              description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id_analysis,
            niosh.lifted_item,
            niosh.horizontal_distance,
            niosh.vertical_distance,
            niosh.vertical_displacement,
            niosh.trunk_twist_angle,
            niosh.average_lift_frequency,
            niosh.grip_quality,
            niosh.load_mass,
            niosh.recommended_weight_limit,
            niosh.lifting_index,
            niosh.description,
          ]
        )
      } else if (owas) {
        methodInsertResult = await conn.query(
          `
            INSERT INTO ergoviewer.owas_method (
                id_analysis, 
                arm_posture, 
                back_posture, 
                leg_posture, 
                lifted_load, 
                analysis_result, 
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id_analysis,
            owas.arm_posture,
            owas.back_posture,
            owas.leg_posture,
            owas.lifted_load,
            owas.analysis_result,
            owas.description,
          ]
        )
      } else if (rula) {
        methodInsertResult = await conn.query(
          `
            INSERT INTO ergoviewer.rula_method (
                id_analysis, 
                arm_position, 
                forearm_position, 
                wrist_position, 
                trunk_position, 
                group_a_time_of_work, 
                group_a_load_supported, 
                group_b_time_of_work, 
                group_b_load_supported, 
                analysis_result, 
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id_analysis,
            rula.arm_position,
            rula.forearm_position,
            rula.wrist_position,
            rula.trunk_position,
            rula.group_a_time_of_work,
            rula.group_a_load_supported,
            rula.group_b_time_of_work,
            rula.group_b_load_supported,
            rula.analysis_result,
            rula.description,
          ]
        )
      } else {
        return { error: 'errorRegistration' }
      }

      if (methodInsertResult.affectedRows === 0) {
        return { error: 'errorRegistration' }
      }

      return { message: 'successfulRegistration' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes('Data too long')) {
        return { error: 'errorDataTooLong' }
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

  async list(id_department, id_user, id_project) {
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
                a.created_at,
                'niosh' as method, 
                nm.lifted_item, 
                nm.horizontal_distance, 
                nm.vertical_distance, 
                nm.vertical_displacement, 
                nm.trunk_twist_angle, 
                nm.average_lift_frequency, 
                nm.grip_quality, 
                nm.load_mass, 
                nm.recommended_weight_limit, 
                nm.lifting_index, 
                nm.description as method_description
            FROM analysis a
            LEFT JOIN department d ON d.id_department = a.id_department
            LEFT JOIN project p ON p.id_project = d.id_project
            LEFT JOIN user u ON u.id_user = a.id_user
            LEFT JOIN ergoviewer.niosh_method nm ON nm.id_analysis = a.id_analysis
            WHERE d.id_department = ? OR u.id_user = ? OR p.id_project = ?
            
            UNION

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
                a.created_at,
                'owas' as method, 
                om.arm_posture, 
                om.back_posture, 
                om.leg_posture, 
                om.lifted_load, 
                om.analysis_result, 
                NULL, 
                NULL, 
                NULL, 
                NULL, 
                NULL, 
                om.description as method_description
            FROM analysis a
            LEFT JOIN department d ON d.id_department = a.id_department
            LEFT JOIN project p ON p.id_project = d.id_project
            LEFT JOIN user u ON u.id_user = a.id_user
            LEFT JOIN ergoviewer.owas_method om ON om.id_analysis = a.id_analysis
            WHERE d.id_department = ? OR u.id_user = ? OR p.id_project = ?

            UNION

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
                a.created_at,
                'rula' as method, 
                rm.arm_position, 
                rm.forearm_position, 
                rm.wrist_position, 
                rm.trunk_position, 
                rm.group_a_time_of_work, 
                rm.group_a_load_supported, 
                rm.group_b_time_of_work, 
                rm.group_b_load_supported, 
                rm.analysis_result, 
                rm.description as method_description
            FROM analysis a
            LEFT JOIN department d ON d.id_department = a.id_department
            LEFT JOIN project p ON p.id_project = d.id_project
            LEFT JOIN user u ON u.id_user = a.id_user
            LEFT JOIN ergoviewer.rula_method rm ON rm.id_analysis = a.id_analysis
            WHERE d.id_department = ? OR u.id_user = ? OR p.id_project = ?
            `,
        [id_department, id_user, id_project, id_department, id_user, id_project, id_department, id_user, id_project]
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
