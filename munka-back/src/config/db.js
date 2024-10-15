import { Sequelize } from "sequelize";

const devSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'test.sqlite',
  logging: false
});

const env = process.env.NODE_ENV
const sequelize = env === 'test' ? testSequelize : devSequelize

export default sequelize;