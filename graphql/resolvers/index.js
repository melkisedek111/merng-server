const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolver = require('./comments');

module.exports = {
    Post: {
        likesCount: parent => parent.likes.length,
        commentsCount: parent => parent.comments.length
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolver.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}