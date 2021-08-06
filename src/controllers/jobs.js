/**
 * TODO:
 *  See if is intern !! logic should be moved to datasources
 */

'use strict'
const queryString = require('query-string')
const dataSources = require('../datasources')

async function getAllJobs (req, res, next) {
  console.log(req.query)
  console.log(req.user)

  const { user, query } = req
  req.responseData = await dataSources.jobs.getAllJobs(user, query)

  return void next()
}

async function getJob (req, res, next) {
  const { user, params } = req

  req.responseData = await dataSources.jobs.getJob(user, params.id)

  return void next()
}

async function updateJob(req, res, next) {
  const { user, params, body } = req
  console.log('updating')
  const job = {
    ...body,
    // TODO: See top
    is_intern: !!body.is_intern
  }

  req.responseData = await dataSources.jobs.updateJob(user, params.id, job)

  return void next()
}

async function createJob(req, res, next) {
  let { user, body: newJob } = req // add 'user' back
  console.log('creating')
  // const cognitoUserId = user.sub

  // add the cognito id to the job
  newJob = {
    ...newJob
    // userId: cognitoUserId
  }

  const job = await dataSources.jobs.createJob(user, newJob)

  req.responseData = job

  res.status(201)

  return void next()
}

async function deleteJob(req, res, next) {
  const { user, params } = req

  req.responseData = await dataSources.jobs.deleteJob(user, params.id)

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