import express from 'express';
import verifyUser from '../middlewares/verifyUser.js';
import { getUserItems , getMarketplaceItems, getUserProfile, getUserBuyTransactions, getUserSellTransactions, purchaseItem} from '../controllers/queries.js';

const router = express.Router();

// GET user/itemsowned for logged in user
router.get('/itemsowned',verifyUser,getUserItems);

router.get('/marketplace',getMarketplaceItems);

router.get('/profile',verifyUser,getUserProfile);

router.get('/buyTransactions',verifyUser,getUserBuyTransactions);

router.get('/sellTransactions',verifyUser,getUserSellTransactions);

router.post('/purchase', verifyUser, purchaseItem);

export default router;