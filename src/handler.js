'use strict'

// express for basic http handling
const express = require('express')

// package used for handling aws cognito tokens
const CognitoExpress = require('cognito-express')

// body parser to deal with json
const bodyParser = require('body-parser')

// middleware to use serverless through AWS
const awsServerlessExpress = require('aws-serverless-express')

// get the routes to use in the app
const routes = require('./routes')

// create the express app
const app = express()

// temporary
const dataSources = require('./datasources')

// create the cognitoExpress middleware
const cognitoExpress = new CognitoExpress({
  region: 'us-east-1',
  cognitoUserPoolId: 'us-east-1_n6AVZMneZ',
  tokenUse: 'id',
  tokenExpiration: 3600000 // 1 hour
})

// attach the cognito express middleware to the routes
app.use((req, res, next) => {
  console.log('THE PATH IS', req.path)

  // for health checks
  if (req.path.endsWith('/api') || req.path.endsWith('/api/')) {
    return res.status(200).send('API is healthy')
  }
  // pet project
  // consider implementing the jwt token stuff yourself
  // let accessTokenFromClient = req.headers.authorization.split(' ')[1]
  let accessTokenFromClient = req.headers.authorization

  if (!accessTokenFromClient) {
    return res.status(401).send('Not authenticated')
  }

  // for offline use only
  console.log('getting user', accessTokenFromClient)
  if (accessTokenFromClient.startsWith('Bearer')) {
    accessTokenFromClient = accessTokenFromClient.split(' ')[1]
  }

  cognitoExpress.validate(accessTokenFromClient, (err, response) => {
    if (err) {
      console.log('ERROR')
      return res.status(401).send(err)
      // res.status(401)
    }

    req.user = response
    // res.locals.user = req.user
    // console.log('jwy res', res.locals)
    // console.log('user', req.user)

    /**
     * Temporary way of making sure a user is added to the database.
     * Once the front end properly overrides the amplify ui's confirm signup
     * function, this can be removed.
     */
    try {
      console.log('try', response)
      dataSources.user.createUser({
        id: response.sub,
        name: response.name,
        email: response.email
      }).then(value => {
        next()
      })
    } catch (err) {
      console.log('Failed to create new user.')
      next() // DELETE THIS IF FAILING
    }
  })
})

// app.use(async (req, res, next) => {
//   console.log('res', JSON.stringify(res.locals))
//   // if (req?.user?.sub) {
//   //   await dataSources.user.createUser(req.user.sub)
//   // }

//   next()
// })

// configure the body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// add a responseData object to the req that can be used
// this is in order to retrieve data from the routes
app.use((req, res, next) => {
  // console.log('reqsreponse', req.user)
  req.responseData = {}
  next()
})

// set the root path and the routes after
app.use('/api', routes)

// create a serverless app using the express app
const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  return awsServerlessExpress.proxy(server, event, context)
}
