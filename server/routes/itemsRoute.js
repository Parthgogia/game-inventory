import express from 'express';
import verifyUser from '../middlewares/verifyUser.js';
import db from '../config/db.js';

const router = express.Router();

// GET items/owned for logged in user
router.get('/owned',verifyUser,async (req,res)=>{
    try {
        const username = req.user.user_name;
        const result = await db.query(
        `SELECT * FROM Item_owned WHERE Owner_id = 
        (SELECT user_id FROM Player WHERE User_name = $1)`,
        [username]);      
        res.send(result.rows);
        // res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
});

export default router;