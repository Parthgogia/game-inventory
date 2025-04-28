import db from '../config/db.js'

export async function register(req, res) {
  const { username, password, email, dob, age } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT * FROM Player WHERE User_name = $1',
      [username]
    );
    if (rows.length) {
      return res.status(409).send('Username taken');
    }
    await db.query(
      `INSERT INTO Player(User_name,Password,Email,Join_Date,DOB,Age)
       VALUES($1,$2,$3,CURRENT_DATE,$4,$5)`,
      [username, password, email, dob, age]
    );
    res.status(200).send("Registration successful")
    // res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT Password FROM Player WHERE User_name = $1',
      [username]
    );
    if (!rows.length) {
      return res.status(404).send('User not found');
    }
    if (rows[0].password !== password) {
      return res.status(401).send('Wrong password');
    }
    const items = await db.query(
      `SELECT * FROM Item_owned WHERE Owner_id =
       (SELECT user_id FROM Player WHERE User_name = $1)`,
      [username]
    );
    res.status(200).send("login successful")
    // res.render('secrets', { items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}