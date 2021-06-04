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

module.exports = {
  getAllSkills,
  getSkill
}
