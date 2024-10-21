const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('./userController');
const pool = require('../config/db');

const login = async (req,res) => {
    try{
        const { email, password, user } = req.body;
        const validpassword = await bcrypt.compare(password, req.user.password_hash);
        if (!validpassword) {
            return res.status(401).json({message: 'Incorrect password'});
        }
        const token = jwt.sign(
            {id: user.id, email: email}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h'}
        );
        res.status(200).json({message: 'Login successful.', token})
    } catch (error){
        res.status(500).json({error: error.message});
    }
}

const logout = async (req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.decode(token)
        const expiry = new Date(decoded.exp * 1000)
        await pool.query('INSERT INTO auth.token_blacklist (token,expiry) VALUES ($1,$2)',[token,expiry])
        res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// NOT TESTED YET
const register = async (req, res) => {
    try{
        await userController.createUser(req, res, async () => {
            const user = res.body; // NOT TESTED
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(201).json({ message: 'User registered successfuly.', token });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    login,
    logout,
    register
};