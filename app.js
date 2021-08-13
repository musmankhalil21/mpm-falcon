const express = require('express')
// const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
// const mysql = require('mysql')
const { db } = require('./config/db')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { GraphQLClient, gql } = require('graphql-request')
const syncForeach = require('sync-foreach')
// const userSchema = require('./schema/UserSchema')
// const orgs = require('./onsign-client/Organizations')

const app = express()
app.use(cors());
app.use(express.json());
// app.use('/graphql', graphqlHTTP({
//     schema: userSchema,
//     // graphiql: true
// }));

app.listen(4000, () => {
    console.log('listening for requests on port 4000')
})

module.exports = { app, db, jwt, gql, GraphQLClient, syncForeach }


require('./REST/auth')
require('./REST/organisations')

