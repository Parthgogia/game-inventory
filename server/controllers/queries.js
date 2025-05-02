import db from '../config/db.js';

export async function getUserItems(req,res){
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
}

export async function getMarketplaceItems(req,res) {
    try {
        const result = await db.query(
            `SELECT
            p.User_name   AS owner_name,    
            li.Name       AS item_name,    
            li.Rarity     AS rarity,        
            im.Selling_price,
            im.Status
            FROM Items_in_Marketplace im
            INNER JOIN Player p
                ON im.Owner_id = p.User_id           
            INNER JOIN Listed_Items li
                ON im.Item_id = li.Item_id;`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function listItem(req, res) {
    const { item_id, selling_price } = req.body;
    const seller_id = req.user.user_id;

    try {
        // Check if item exists in Listed_Items
        const listedItem = await db.query(
            `SELECT * FROM Listed_Items 
            WHERE Item_id = $1 AND User_id = $2`,
            [item_id, seller_id]
        );
        
        if (listedItem.rows.length === 0) {
            return res.status(400).json({ message: 'Item not available for listing' });
        }

        // Verify ownership
        const ownership = await db.query(
            `SELECT * FROM Item_Owned 
            WHERE Item_id = $1 AND Owner_id = $2`,
            [item_id, seller_id]
        );
        
        if (ownership.rows.length === 0) {
            return res.status(403).json({ message: 'You do not own this item' });
        }

        // Calculate commission
        const commission = selling_price * 0.1;

        // Get admin from Listed_Items
        const admin_id = listedItem.rows[0].admin_id;

        // List item in marketplace
        await db.query(
            `INSERT INTO Items_in_Marketplace 
            (Item_id, Seller_id, Owner_id, Selling_price, Status, Commission, Admin_id)
            VALUES ($1, $2, $3, $4, 'listed', $5, $6)`,
            [item_id, seller_id, seller_id, selling_price, commission, admin_id]
        );

        res.status(201).json({ message: 'Item listed successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function purchaseItem(req, res) {
    const { item_name, owner_name } = req.body;
    const buyerUsername = req.user.user_name;
  
    try {
      // 1. Get buyer_id
      const buyerRes = await db.query(
        `SELECT user_id FROM Player WHERE user_name = $1`,
        [buyerUsername]
      );
      if (buyerRes.rows.length === 0) {
        return res.status(404).json({ message: 'Buyer not found' });
      }
      const buyer_id = buyerRes.rows[0].user_id;
  
      // 2. Get seller_id from owner_name
      const sellerRes = await db.query(
        `SELECT user_id FROM Player WHERE user_name = $1`,
        [owner_name]
      );
      if (sellerRes.rows.length === 0) {
        return res.status(404).json({ message: 'Owner/Seller not found' });
      }
      const seller_id = sellerRes.rows[0].user_id;
  
      // 3. Get item_id from item_name and ensure ownership
      const itemRes = await db.query(
        `SELECT item_id FROM Item_Owned WHERE name = $1 AND owner_id = $2`,
        [item_name, seller_id]
      );
      if (itemRes.rows.length === 0) {
        return res.status(404).json({ message: 'Item not found for that owner' });
      }
      const item_id = itemRes.rows[0].item_id;
  
      // 4. Fetch buyer wallet up front (needed later inside transaction)
      const buyerWalletRes = await db.query(
        `SELECT wallet_id, uc FROM Wallet WHERE user_id = $1`,
        [buyer_id]
      );
      if (buyerWalletRes.rows.length === 0) {
        return res.status(404).json({ message: 'Buyer wallet not found' });
      }
      const buyerWallet = buyerWalletRes.rows[0];
  
      const client = await db.connect();
      try {
        await client.query('BEGIN');
  
        // Lock the marketplace listing
        const listingRes = await client.query(
          `SELECT * FROM Items_in_Marketplace
           WHERE item_id = $1 AND seller_id = $2
           FOR UPDATE`,
          [item_id, seller_id]
        );
        if (listingRes.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ message: 'Marketplace listing not found' });
        }
        const listing = listingRes.rows[0];
        const totalPrice = listing.selling_price;
        const commission = listing.commission;
  
        // Check funds
        if (buyerWallet.uc < totalPrice) {
          await client.query('ROLLBACK');
          return res.status(400).json({ message: 'Insufficient funds' });
        }
  
        // Deduct buyer
        await client.query(
          `UPDATE Wallet SET uc = uc - $1 WHERE user_id = $2`,
          [totalPrice, buyer_id]
        );
  
        // Pay seller (minus commission)
        await client.query(
          `UPDATE Wallet SET uc = uc + $1 WHERE user_id = $2`,
          [totalPrice - commission, seller_id]
        );
  
        // Transfer ownership in Item_Owned
        await client.query(
          `UPDATE Item_Owned SET owner_id = $1 WHERE item_id = $2`,
          [buyer_id, item_id]
        );
  
        // Mark as sold in marketplace
        await client.query(
          `UPDATE Items_in_Marketplace
           SET status = 'sold', owner_id = $1
           WHERE item_id = $2 AND seller_id = $3`,
          [buyer_id, item_id, seller_id]
        );
  
        // Generate new transaction ID
        const tIdRes = await client.query(
          `SELECT COALESCE(MAX(t_id), 0) + 1 AS new_t_id
           FROM Transaction
           WHERE wallet_id = $1`,
          [buyerWallet.wallet_id]
        );
        const newTId = tIdRes.rows[0].new_t_id;
  
        // Record transaction
        await client.query(
          `INSERT INTO Transaction
           (t_id, wallet_id, t_date, item_id, buyer_id, seller_id, status, amount)
           VALUES ($1, $2, NOW(), $3, $4, $5, 'completed', $6)`,
          [
            newTId,
            buyerWallet.wallet_id,
            item_id,
            buyer_id,
            seller_id,
            totalPrice
          ]
        );
  
        await client.query('COMMIT');
        return res.json({ message: 'Purchase successful' });
  
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', err);
        return res.status(500).json({ message: 'Server error during purchase' });
      } finally {
        client.release();
      }
  
    } catch (err) {
      console.error('PurchaseItem error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  

