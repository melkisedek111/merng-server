const {AuthenticationError} = require('apollo-server');

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
	// context = { ...headers }
	const authHeader = context.req.headers.authorization; // get the authorization from request header 
	if (authHeader) {
        // token that has bearer . . . .
        const token = authHeader.split('Bearer ')[1]; // get the second index of the split
        if(token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (error) {
                throw new AuthenticationError('Invalid/Expired Token');
            }
        }
        throw new AuthenticationError("Authentication token must be 'Bearer[token']");
    }
    throw new AuthenticationError("Authorization token header must be provided");
};
