import { diskStorage } from 'multer'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

export const UtilImportarImg = {
  storage: diskStorage({
    destination: function (req, file, callback) {
      if (process.env.VERSION === 'PROD') {
        callback(null, __dirname + '/../../../avatars')
      } else {
        callback(null, __dirname + '/../../avatars')
      }
    },
    filename: function (req, file, callback) {
      const name = file.originalname.split(' - ')[0]
      callback(null, name + '.JPG')
    },
  }),
}
