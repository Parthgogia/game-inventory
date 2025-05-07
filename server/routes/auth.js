import express from 'express';
import { register, loginUser, loginAdmin } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/register', register);

router.post('/loginUser', loginUser);

router.post('/loginAdmin', loginAdmin);

export default router;