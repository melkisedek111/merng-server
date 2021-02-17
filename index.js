const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require('./graphql/typeDefs');
const { MONGODB } = require("./config.js");
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();
const PORT = process.env.PORT || 5000;
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({req}) => ({req, pubsub}) // to get access to all request headers just like middlewares
});  

mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected");
		return server.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`Server running at ${res.url}`);
	})
	.catch(err => {
		console.error(err)
	})
