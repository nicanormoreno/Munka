import {User} from '../models/index.js'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/', async(req,res)=> {
    const {email, password} = req.body
    try {
        const user = await User.findOne({ where: { mail: email } });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            name: user.name,
            lastname: user.lastName,
            email: user.mail,
            token: token,
        });
      } catch (error) {
        res.status(400).json({ message: 'Login failed', error });
      }
  
  })

  export default router