import express from 'express'
import { User } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const users = await User.findAll()
        res.json(users);
    }catch(error){
        res.status(404).json({error})
    }
})

export default router