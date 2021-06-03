'use strict'

// express for basic http handling
const express = require('express')

// body parser to deal with json
const bodyParser = require('body-parser')

// middleware to use serverless through AWS
const awsServerlessExpress = require('aws-serverless-express')

// get the routes to use in the app
const routes = require('./routes')

// create the express app
const app = express()

// configure the body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// add a responseData object to the req that can be used
// this is in order to retrieve data from the routes
app.use((req, res, next) => {
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
