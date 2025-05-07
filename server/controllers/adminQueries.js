import db from '../config/db.js';

export async function getListedItems(req,res){
    try {
        const username = req.user.user_name;
        const result = await db.query(
          `SELECT item_id,name,type,rarity,uc_price FROM LISTED_ITEMS;`
        );    
        res.send(result.rows);
        // res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getAdminMarketplace(req,res) {
    try {
        const result = await db.query(
            `SELECT
            p.User_name   AS owner_name, 
            p.user_id     AS seller_id,   
            li.Name       AS item_name,    
            li.Rarity     AS rarity,        
            im.Selling_price,
            im.Status,
            im.commission,
            li.item_id    AS item_id
            FROM Items_in_Marketplace im
            INNER JOIN Player p
                ON im.Owner_id = p.User_id           
            INNER JOIN Listed_Items li
                ON im.Item_id = li.Item_id;`
        );
        // res.json(result.rows);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteMarketplaceItem(req,res) {
    const { item_id ,seller_id} = req.body;
    
    if (!Number.isInteger(item_id) || !Number.isInteger(seller_id)) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid IDs' });
      }
    
    try {
    const result = await db.query(
        `DELETE FROM Items_in_Marketplace
        WHERE Item_id   = $1
        AND Seller_id = $2`,
        [item_id, seller_id]
    );

    if (result.rowCount === 0) {
        return res
        .status(404)
        .json({ success: false, message: 'Listing not found' });
    }
    return res.json({ success: true, deletedCount: result.rowCount });
    } catch (err) {
    console.error(err);
    return res
        .status(500)
        .json({ success: false, message: 'Server error' });
    }
}

export async function setCommission(req,res) {
    const { commission, item_id ,seller_id} = req.body;

    if (
        typeof commission !== 'number' ||
        commission < 0 ||
        commission > 1 ||
        !Number.isInteger(item_id) ||
        !Number.isInteger(seller_id)
        ) {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid payload.' });
        }
    
        try {
        const result = await db.query(
            `UPDATE Items_in_Marketplace
            SET Commission  = $1
            WHERE Item_id   = $2
            AND Seller_id   = $3`,    
            [commission, item_id, seller_id]
        );
    
        if (result.rowCount === 0) {
            return res
            .status(404)
            .json({ success: false, message: 'Listing not found.' });
        }
    
        return res.json({
            success: true,
            message: 'Commission updated successfully'
        });


    } catch (error) {
        console.error('Error updating commission:', error);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Server error while updating commission.'
        });
    }
}

export async function deleteListedItem(req,res) {
    const { item_id } = req.body;
    try {
        const result = await db.query(
            `DELETE FROM LISTED_ITEMS
            WHERE Item_id   = $1`,
            [item_id]
        );
    
        if (result.rowCount === 0) {
            return res
            .status(404)
            .json({ success: false, message: 'Item not found' });
        }
        return res.json({ success: true, deletedCount: result.rowCount });
        } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: 'Server error' });
        }
}

export async function addItem(req, res) {
    const { name, type, rarity, uc_price } = req.body;
    
    if (!name || !type || !rarity || !uc_price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await db.query('CALL add_listed_item($1, $2, $3, $4)', [
            name, 
            type, 
            rarity, 
            uc_price
        ]);

        const result = await db.query(
            `SELECT * FROM Listed_Items 
             WHERE Name = $1 AND Type = $2 AND Rarity = $3`,
            [name, type, rarity]
        );

        res.status(201).json({ 
            success: true, 
            item: result.rows[0],
            message: 'Item added successfully'
        });

    } catch (err) {
        console.error(err);
        
        if (err.message === 'Item_Exists') {
            return res.status(409).json({ 
                message: 'Item with these attributes already exists' 
            });
        }

        res.status(500).json({ 
            message: 'Server error', 
            error: err.message 
        });
    }
}


