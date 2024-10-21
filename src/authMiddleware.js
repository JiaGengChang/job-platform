const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;
        const users = await pool.query('SELECT * FROM auth.users WHERE email=$1',[email]);
        if (users.rows.length===0) {
            return res.status(401).json({message: 'Email does not exist in records.'});
        }
        req.user = users.rows[0];
        next();
    } catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const result = await pool.query('SELECT * FROM auth.token_blacklist WHERE token = $1', [token]);
        if (result.rows.length > 0) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    verifyEmailExists,
    authenticateToken
};