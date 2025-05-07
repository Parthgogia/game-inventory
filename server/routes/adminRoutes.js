import express from 'express';
import verifyUser from '../middlewares/verifyUser.js';
import { getListedItems, getAdminMarketplace, deleteMarketplaceItem, deleteListedItem, setCommission, addItem} from '../controllers/adminQueries.js';

const router = express.Router();

// GET user/itemsowned for logged in user
router.get('/listedItems',verifyUser,getListedItems);

router.get('/marketplace',verifyUser,getAdminMarketplace);

router.delete('/deleteMarketplaceItem',verifyUser,deleteMarketplaceItem);

router.patch('/updateCommission',verifyUser,setCommission);

router.delete('/deleteListedItem',verifyUser,deleteListedItem);

router.post('/addItem',verifyUser,addItem);

export default router;