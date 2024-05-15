import multer, { diskStorage } from 'multer'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

export const UtilImportarCSV = {
  storage: diskStorage({
    destination: function (req, file, callback) {
      callback(null, __dirname + '/../../planilha')
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname)
    },
  }),
}

export const UtilImportarImg = {
  storage: diskStorage({
    destination: function (req, file, callback) {
      if (process.env.VERSION === 'PROD') {
        callback(null, __dirname + '/../../../aluno_carteirinha_fotos')
      } else {
        callback(null, __dirname + '/../../fotos_alunos')
      }
    },
    filename: function (req, file, callback) {
      const name = file.originalname.split(' - ')[0]
      callback(null, name + '.JPG')
    },
  }),
}
