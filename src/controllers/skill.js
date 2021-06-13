'use strict'

const dataSources = require('../datasources')

async function getAllSkills (req, res, next) {
  req.responseData = await dataSources.skills.getAllSkills()

  return void next()
}

async function getSkill (req, res, next) {
  const { params } = req

  req.responseData = await dataSources.skills.getSkill(params.id)

  return void next()
}

async function createSkill (req, res, next) {
  const { body: skill } = req

  req.responseData = await dataSources.skills.createSkill(skill)

  res.status(201)

  return void next()
}

async function updateSkill (req, res, next) {
  const { params, body: skill } = req

  req.responseData = await dataSources.skills.updateSkill(params.id, skill)

  return void next()
}

async function deleteSkill (req, res, next) {
  const { params } = req

  req.responseData = await dataSources.skills.deleteSkill(params.id)

  res.status(204)

  return void next()
}

module.exports = {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
}
