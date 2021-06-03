'use strict'

const dataSources = require('../datasources')

async function getAllJobs (req, res, next) {
  req.responseData = await dataSources.job.getAllJobs()

  return void next()
}

async function getJob (req, res, next) {
  req.responseData = await dataSources.job.getJob()

  return void next()
}

module.exports = {
  getAllJobs,
  getJob
}