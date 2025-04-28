import express from 'express';
import { register, login } from '../controllers/authcontroller.js';

const authRouter = express.Router();

authRouter.get('/register', (req, res) => {
//   res.render('register.ejs');
});

authRouter.post('/register', register);

authRouter.get('/login', (req, res) => {
//   res.render('login.ejs');
    
});

authRouter.post('/login', login);

export default authRouter;