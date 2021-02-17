const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
	validateRegisterInput,
	validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

const generateToken = (user) => {
    return jwt.sign(
        {
            //creating json web token for data encryption
            id: user.id,
            email: user.email,
            username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
}

module.exports = {
	Mutation: {
		login: async (_, { username, password }) => {
            const { errors, valid } = validateLoginInput(username, password);
			if(!valid) throw new UserInputError('Errors', {errors});
			const user = await User.findOne({username});
            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found!', {errors});
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }

			const token = generateToken(user);
			return {
				...user._doc, // get the document after saving
				id: user._id, // as well as the id
				token, // the token that will be send
			};
		},
		register: async (
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) => {
			// TODO Validate user data
			const { errors, valid } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			// TODO, Make sure user doesnt already exists
			const checkUser = await User.findOne({ username });
			const checkEmail = await User.findOne({ email });
			if (checkUser) {
				throw new UserInputError("Username is already taken", {
					errors: {
						username: "This username is already taken",
					},
				});
			}
			if (checkEmail) {
				throw new UserInputError("Email is already taken", {
					errors: {
						email: "This Email is already taken",
					},
				});
			}
			// TODO hash password and craete an auth token (Finished)
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				// User from User Model
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save(); // save to the database

			const token = generateToken(res);

			return {
				...res._doc, // get the document after saving
				id: res._id, // as well as the id
				token, // the token that will be send
			};
		},
	},
};
