import db from '../config/db.js'
import jwt from 'jsonwebtoken';

export async function register(req, res) {
  const { username, password, email, dob} = req.body;
  try {
    const { rows } = await db.query(
      'SELECT * FROM Player WHERE User_name = $1',
      [username]
    );
    if (rows.length) {
      return res.status(409).send('Username taken');
    }
    await db.query(
      `INSERT INTO Player(User_name,Password,Email,Join_Date,DOB)
       VALUES($1,$2,$3,CURRENT_DATE,$4)`,
      [username, password, email, dob]
    );
    res.status(200).send("Registration successful")
    // res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT User_name, Password FROM Player WHERE User_name = $1',
      [username]
    );
    if (!rows.length) {
      return res.status(404).send('User not found');
    }
    if (rows[0].password !== password) {
      return res.status(401).send('Wrong password');
    }
    console.log("User logged in: ",rows[0]);
    
    const token = jwt.sign(
      {user_name: rows[0].user_name},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );
    res.json({token});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export async function loginAdmin(req, res) {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT user_name, Password FROM Admin WHERE user_name = $1',
      [username]
    );
    if (!rows.length) {
      return res.status(404).send('User not found');
    }
    if (rows[0].password !== password) {
      return res.status(401).send('Wrong password');
    }
    console.log("Admin logged in: ",rows[0]);
    
    const token = jwt.sign(
      {user_name: rows[0].user_name},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );
    res.json({token});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}