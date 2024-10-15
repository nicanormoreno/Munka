import { seed } from './seed.js'
import sequelize from './db.js'

await sequelize.drop()
seed()