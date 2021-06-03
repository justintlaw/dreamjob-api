'use strict'

const dataSources = require('../datasources')

async function getAllUsers (req, res, next) {
  req.responseData = await dataSources.user.getAllUsers()

  return void next()
}

async function getUser (req, res, next) {
  req.responseData = await dataSources.user.getUser(3)

  return void next()
}

module.exports = {
  getAllUsers,
  getUser
}
