const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await db.query('SELECT * FROM fin.users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert into Database
    const newUser = await db.query(
      'INSERT INTO fin.users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully!',
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email in the 'fin' schema
    const result = await db.query('SELECT * FROM fin.users WHERE email = $1', [email]);
    const user = result.rows[0];

    // 2. Security Tip: Use generic messages so hackers don't know if the email exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. Compare the typed password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 4. Create a JWT Token (The Digital ID Card)
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
};