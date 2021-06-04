'use strict'

const dataSources = require('../datasources')

async function getAllUsers (req, res, next) {
  req.responseData = await dataSources.user.getAllUsers()

  return void next()
}

async function getUser (req, res, next) {
  const { params } = req

  req.responseData = await dataSources.user.getUser(params.id)

  return void next()
}

module.exports = {
  getAllUsers,
  getUser
}
