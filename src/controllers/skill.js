'use strict'

const dataSources = require('../datasources')

async function getAllSkills (req, res, next) {
  req.responseData = await dataSources.job.getAllSkills()

  return void next()
}

async function getSkill (req, res, next) {
  req.responseData = await dataSources.job.getSkill()

  return void next()
}

module.exports = {
  getAllSkills,
  getSkill
}
