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

async function updateJob(req, res, next) {
  const { params, body } = req
  const job = {
    ...body,
    is_intern: !!body.is_intern
  }

  req.responseData = await dataSources.jobs.updateJob(params.id, job)

  return void next()
}

async function createJob(req, res, next) {
  const { body: job } = req

  console.log(job)

  req.responseData = await dataSources.jobs.createJob(job)

  res.status(201)

  return void next()
}

async function deleteJob(req, res, next) {
  const { params } = req

  req.responseData = await dataSources.jobs.deleteJob(params.id)

  res.status(204)

  return void next()
}

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  createJob,
  deleteJob
}