'use strict'

const dataSources = require('../datasources')

async function getAllJobs (req, res, next) {
  req.responseData = await dataSources.jobs.getAllJobs()

  return void next()
}

async function getJob (req, res, next) {
  const { params } = req

  req.responseData = await dataSources.jobs.getJob(params.id)

  return void next()
}

module.exports = {
  getAllJobs,
  getJob
}