// accept http requests, interact with job model, and send responses back to client
const userModel = require('./userModel');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const userController = {
    async createUser(req,res){
        const allowedRoles=['user','moderator','admin']
        try{
            const {username, email, password, role} = req.body;
            if (!username ||!email ||!password) {
                return res.status(400).json({ message: 'One or more fields are blank' });
            }
            const emailExists = await userModel.emailAddressInUse(email);
            if (emailExists){
                return res.status(400).json({ message: 'Email address in use.' })
            }
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const createdUser = await userModel.createUser(username, email, hashedPassword, role);
            res.status(201).json(createdUser);
        }
        catch(error){
            console.log(error);
            res.status(500).json({message: 'Failed to create user.'})
        };
    },
    async findAllUsers(req,res){
        try{
            const results = await userModel.findAllUsers()
            res.status(200).json(results);
        }
        catch(error){
            console.log(error);
            res.status(500).json({message: 'Failed to get all users.'})
        };
    },
    async findUserById(req,res){
        try{
            //FIXME results may be undefined
            const userID = req.params.id;
            const results = await userModel.findUserById(userID);
            res.status(200).json(results);
        }
        catch(error){
            console.log(error);
            res.status(500).json({message: 'Failed to find user.'})
        };
    },
    async findUserByIdAndUpdate(req,res){
        try{
            const {new_username, new_email, password, new_password } = req.body;
            if (!password){
                return res.status(400).json({ message: 'Provide current password.'})
            }
            if (!new_username && !new_email && !new_password) {
                return res.status(400).json({ message: 'Update one of username, email, or password.' });
            }
            // new email cannot be in use
            if (new_email != null){
                const emailExists = await userModel.emailAddressInUse(new_email);
                if (emailExists){
                    return res.status(400).json({ message: 'Email address in use.' })
                }
            }
            // if new password is provided, hash it
            const new_password_hash = new_password ? await bcrypt.hash(new_password, 10) : null;
            const userID = parseInt(req.params.id);
            const results = await userModel.findUserByIdAndUpdate(userID, new_username, new_email, new_password_hash);
            res.status(200).json(results);
        }
        catch(error){
            console.log(error);
            res.status(500).json({message: 'Failed to update user.'})
        };
    },
    async findUserByIdAndDelete(req,res){
        try{
            const userID = req.params.id;
            await userModel.findUserByIdAndDelete(userID);
            res.status(200).json({ message: 'User deleted.' });
        }
        catch(error){
            console.log(error);
            res.status(500).json({message: 'Failed to delete user.'})
        };
    }
}

module.exports = userController;