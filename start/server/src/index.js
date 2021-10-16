// providing support for reading environment variables from the .env file
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail')

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// to set up SQLite database
const store = createStore();

const server = new ApolloServer({
    context: async ({req}) => {
        // auth check on every request
        const auth = req.headers && req.headers.authorization || ''
        // decode the value of Authorization header
        const email = Buffer.from(auth, 'base64').toString('ascii')
        if(!isEmail.validate(email)) return {user: null}
        // find a user by their email
        const users = await store.users.findOrCreate({where: {email}})
        const user = users && users[0] || null
        return {user: {...user.dataValues}}
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store })
      })
});

server.listen().then(() => {
    console.log(`
      Server is running!
      Listening on port 4000
      Explore at https://studio.apollographql.com/sandbox
    `);
  });
  
  
