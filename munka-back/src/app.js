
import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import path from 'path'
import { resolve } from 'path'
import sequelize from './config/db.js'
import cors from 'cors'

import usersRoute from './routes/users.js'
import couponsRouter from './routes/coupons.js'
import buyOrderRoute from './routes/buyOrder.js'
import authRoute from './routes/auth.js'
import authenticateToken from './middleware/auth.middleware.js';

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(resolve(), 'public')));
app.use(cors({origin:'http://localhost:3000'}))
app.use('/users', usersRoute);
app.use('/coupons', authenticateToken, couponsRouter)
app.use('/buyOrders', buyOrderRoute)
app.use('/login', authRoute)

const PORT = process.env.PORT || 3002;

try{
    await sequelize.sync({ force: true })
    console.log('Data Base connected.');

    app.listen(PORT, ()=>{
        console.log('running in port ', PORT)
    })

}catch(error) {console.log(error)}

export default app

