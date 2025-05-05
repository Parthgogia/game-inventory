import express from 'express';
import verifyUser from '../middlewares/verifyUser.js';
import { getUserItems , getMarketplaceItems, getUserProfile, getUserBuyTransactions, getUserSellTransactions, purchaseItem, listItemInMarketplace} from '../controllers/userQueries.js';

const router = express.Router();

// GET user/itemsowned for logged in user
router.get('/itemsowned',verifyUser,getUserItems);

router.get('/marketplace',getMarketplaceItems);

router.get('/profile',verifyUser,getUserProfile);

router.get('/buyTransactions',verifyUser,getUserBuyTransactions);

router.get('/sellTransactions',verifyUser,getUserSellTransactions);

router.post('/purchase', verifyUser, purchaseItem);

router.post('/listItem', verifyUser, listItemInMarketplace);

export default router;