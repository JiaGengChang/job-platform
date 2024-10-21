const userModel = require('./userModel');

const userMiddleware = {
    async checkUserExists(req, res, next) {
        try {
            const userID = req.params.id;
            const userQuery = await userModel.findUserById(userID);
            if (!userQuery) {
                return res.status(404).json({ message: 'User ID does not exist' });
            }
            // Attach the user data to the request object for further use
            req.user = userQuery;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = userMiddleware;