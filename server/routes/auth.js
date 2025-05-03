import express from 'express';
import { register, login } from '../controllers/authcontroller.js';

const router = express.Router();

router.get('/register', (req, res) => {
//   res.render('register.ejs');
});

router.post('/register', register);

router.get('/login', (req, res) => {
//   res.render('login.ejs');
});

router.post('/login', login);


export default router;