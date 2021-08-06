'use strict'

const dataSources = require('../datasources')

async function getAllUsers (req, res, next) {
  req.responseData = await dataSources.user.getAllUsers()

  return void next()
}

async function getUser (req, res, next) {
  const { params, user } = req

  req.responseData = await dataSources.user.getUser(user, params.id)

  return void next()
}

async function createUser (req, res, next) {
  const { user } = req

  req.responseData = await dataSources.user.createUser(user)

  return void next()
}

async function addSkillToUser (req, res, next) {
  const { user, params, body } = req
  const { skill } = body

  req.responseData = await dataSources.user.addSkillToUser(user.sub, params.id, skill)

  return void next()
}

async function removeSkillFromUser (req, res, next) {
  const { user, params, body } = req
  const { skill } = body

  req.responseData = await dataSources.user.removeSkillFromUser(user.sub, params.id, skill)

  return void next()
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  addSkillToUser,
  removeSkillFromUser
}
