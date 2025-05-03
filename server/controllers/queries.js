import db from '../config/db.js';

export async function getUserItems(req,res){
    try {
        const username = req.user.user_name;
        const result = await db.query(
          `
          SELECT
            li.Name  AS item_name,
            li.Type  AS item_type,
            li.Rarity AS item_rarity
          FROM
            Item_Owned io
            JOIN Listed_Items li
              ON io.Item_id = li.Item_id
          WHERE
            io.Owner_id = (
              SELECT User_id
                FROM Player
               WHERE User_name = $1
            )
          `,
          [username]
        );    
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
            p.user_id     AS seller_id,   
            li.Name       AS item_name,    
            li.Rarity     AS rarity,        
            im.Selling_price,
            im.Status,
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

export async function getUserProfile(req,res) {
  try {
    const username = req.user.user_name;
    const result = await db.query(
    `SELECT p.user_id,p.user_name,p.email,p.level,w.bp,w.uc
    FROM Player p
    JOIN Wallet w ON w.user_id = p.user_id
    WHERE
    p.user_name = $1;`,[username]);      
    res.send(result.rows);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getUserBuyTransactions(req,res) {
  try {
    const username = req.user.user_name;
    const result = await db.query(
      `
      SELECT
        t.t_id          AS transaction_id,
        t.t_date        AS transaction_date,
        pb.user_name    AS buyer_name,
        ps.user_name    AS seller_name,
        io.name         AS item_name,
        t.selling_price AS selling_price,
        t.status        AS status
      FROM
        Transaction t
        JOIN Player pb
          ON t.buyer_id  = pb.user_id
        JOIN Player ps
          ON t.seller_id = ps.user_id
        JOIN Item_Owned io
          ON t.item_id   = io.item_id
      WHERE
        pb.user_name = $1
      `,
      [username]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getUserSellTransactions(req,res) {
  try {
    const username = req.user.user_name;
    const result = await db.query(
      `
      SELECT
        t.t_id          AS transaction_id,
        t.t_date        AS transaction_date,
        pb.user_name    AS buyer_name,
        ps.user_name    AS seller_name,
        io.name         AS item_name,
        t.selling_price AS selling_price,
        t.status        AS status
      FROM
        Transaction t
        JOIN Player pb
          ON t.buyer_id  = pb.user_id
        JOIN Player ps
          ON t.seller_id = ps.user_id
        JOIN Item_Owned io
          ON t.item_id   = io.item_id
      WHERE
        ps.user_name = $1
      `,
      [username]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function purchaseItem(req, res) {
  const { seller_id, item_id } = req.body;
  try {
    const username = req.user.user_name;
    const result = await db.query(
          `SELECT user_id FROM PLAYER WHERE user_name = $1`,
          [username]);  
    const buyer_id = result.rows[0].user_id   
    await db.query(
      'CALL purchase_item($1, $2, $3)',
      [seller_id, buyer_id, item_id]
    );
    
    res.json({ 
      success: true,
      message: 'Item purchased successfully'
    });
  } catch (error) {
    console.error('Purchase error:', error);
    const errorMessage = error.message
      .split('CONTEXT:')[0]  
      .replace(/^ERROR: /, '')  
      .trim();

    res.status(500).json({
      success: false,
      message: errorMessage || 'Failed to complete purchase'
    });
  }
}

