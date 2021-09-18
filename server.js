'use strict'

/**
 * TODO: set port dynamically
 * Set so the db calls which version of mysql configurations
 * through env variables
 */

// express for basic http handling
const express = require('express')

// use for cors
const cors = require('cors')

// package used for handling aws cognito tokens
const CognitoExpress = require('cognito-express')

// create the cognitoExpress middleware
const cognitoExpress = new CognitoExpress({
  region: 'us-east-1',
  cognitoUserPoolId: 'us-east-1_n6AVZMneZ',
  tokenUse: 'id',
  tokenExpiration: 3600000 // 1 hour
})

// body parser to deal with json
const bodyParser = require('body-parser')

// get the routes to use in the app
const routes = require('./src/routes')

// datasources for creating a user in middleware
const dataSources = require('./src/datasources')

// create the express app
const app = express()

// use cors headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization', 'Accept']
}))

// configure the body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// add a responseData object to the req that can be used
// this is in order to retrieve data from the routes
app.use((req, res, next) => {
    req.responseData = {}
    next()
})

// attach the cognito express middleware to the routes
app.use((req, res, next) => {
  // used to ensure the health checks from the ELB are successful
  if (req.path === '/') {
    console.log('Health check', req.path)
    return res.status(200).send('API is healthy')
  }

  let accessTokenFromClient = req.headers.authorization

  if (!accessTokenFromClient) {
    return res.status(401).send('Not authenticated')
  }

  // for offline use only
  if (accessTokenFromClient.startsWith('Bearer')) {
    accessTokenFromClient = accessTokenFromClient.split(' ')[1]
  }

  cognitoExpress.validate(accessTokenFromClient, (err, response) => {
    if (err) {
      console.log('ERROR')
      return res.status(401).send(err)
    }

    req.user = response

    /**
     * Temporary way of making sure a user is added to the database.
     * Once the front end properly overrides the amplify ui's confirm signup
     * function, this can be removed.
     */
    // probably, .catch() should be used instead of "try...catch"
    try {
      dataSources.user.createUser({
        id: response.sub,
        name: response.name,
        email: response.email
      }).then(() => {
        next()
      })
    } catch (err) {
      console.log('Failed to create new user', err)
      next() // DELETE THIS IF FAILING
    }
  })
})

// set the root path and the routes after
app.use('/api', routes)

app.listen(3001, () => console.log('API listening on port 3001'))
