// CRUD functionality for users
const pool = require('../config/db');

const userModel = {
    async createUser(username, email, password_hash, role){
        const insertedUser = await pool.query(`
            INSERT INTO auth.users (username, email, password_hash) 
            VALUES ($1,$2,$3)
            RETURNING *;
        `,[username, email, password_hash])
        const userID = insertedUser.rows[0].id;
        const roleIDresult = await pool.query(`SELECT * from auth.roles WHERE name=$1`,[role])
        const roleID = roleIDresult.rows[0].id;
        await pool.query(`INSERT INTO auth.user_roles (user_id, role_id) VALUES ($1, $2)`,[userID, roleID]);
        return insertedUser.rows[0];
    },
    // this is currently an internal function, but is safe to expose to API
    async emailAddressInUse(email){
        const results = await pool.query(`SELECT * FROM auth.users WHERE email=$1`,[email]);
        if (results.rows.length>1){
            throw Error('multiple of this email exists in database')
        }
        return results.rows.length===1;
    },
    async findAllUsers(){
        const results = await pool.query(`SELECT * FROM auth.users`)
        return results.rows;
    },
    async findUserById(userID){
        const results = await pool.query(`SELECT * FROM auth.users WHERE id=$1`,[userID])
        return results.rows[0];
    },
    async findUserByIdAndUpdate(userID, updated_username, updated_email, updated_password_hash){
        //second check for valid userID 
        const userQuery = await pool.query(`SELECT * FROM auth.users WHERE id=$1`,[userID]);
        if (userQuery.rows.length!==1){
            throw Error('user not found');
        }
        const originalUser = userQuery.rows[0];
        const updatedUser = await pool.query(`
            UPDATE auth.users
            SET username=$1,
                email=$2,
                password_hash=$3
            WHERE id=$4
            RETURNING *;
        `,[
            updated_username || originalUser.username,
            updated_email || originalUser.email,
            updated_password_hash || originalUser.password_hash,
            userID
        ])
        return updatedUser.rows[0];
    },
    async findUserByIdAndDelete(userID){
        await pool.query(`DELETE FROM auth.user_roles WHERE user_id=$1`, [userID]);
        await pool.query(`DELETE FROM auth.users WHERE id=$1`, [userID]);
    },
};

module.exports = userModel;