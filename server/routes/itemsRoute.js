import express from 'express';
import verifyUser from '../middlewares/verifyUser.js';
import db from '../config/db.js';
import { getUserItems , getMarketplaceItems ,purchaseItem } from '../controllers/queries.js';

const router = express.Router();

// GET user/items/owned for logged in user
router.get('/items/owned',verifyUser,getUserItems);

router.get('/marketplace',getMarketplaceItems);

router.post('/purchase', verifyUser, purchaseItem);

export default router;