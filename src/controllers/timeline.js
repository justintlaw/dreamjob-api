'use strict'

const dataSources = require('../datasources')

async function getAllTimelines (req, res, next){
  const { user } = req

  req.responseData = await dataSources.timeline.getAllTimelines(user)

  return void next()
}

async function getTimeline (req, res, next) {
  const { params, user } = req

  // console.log('controller', cognitoUserId)

  req.responseData = await dataSources.timeline.getTimeline(user, params.id)

  return void next()
}

async function updateTimeline (req, res, next) {
  const { params, user, body } = req
  console.log('params', params)

  req.responseData = await dataSources.timeline.updateTimeline(user, params.id, body.newName)
  console.log(req.responseData)
  return void next()
}

async function createTimeline (req, res, next) {
  const { user } = req

  req.responseData = await dataSources.timeline.createTimeline(user)

  return void next()
}

async function deleteTimeline (req, res, next) {
  const { params, user } = req

  req.responseData = await dataSources.timeline.deleteTimeline(user, params.id)

  res.status(204)

  return void next()
}

async function getTimelineStats (req, res, next) {
  const { user, params, body } = req

  req.responseData = await dataSources.timeline.getTimelineStats(user, params.id, body)

  return void next()
}

async function addJobToTimeline (req, res, next) {
  console.log('adding job')
  const { params, body, user } = req
  console.log('controller user', user)
  const { jobId, startDate, endDate } = body

  req.responseData = await dataSources.timeline.addJobToTimeline(
    user,
    params.id,
    {
      jobId,
      startDate,
      endDate
    }
  )

  return void next()
}

async function updateTimelineJob (req, res, next) {
  const { params, body, user } = req
  const { startDate, endDate } = body

  req.responseData = await dataSources.timeline.updateTimelineJob(
    user,
    params.id,
    {
      jobId: params.jobId,
      startDate,
      endDate
    }
  )
  console.log('responseData', req.responseData)

  return void next()
}

async function removeJobFromTimeline (req, res, next) {
  const { params, user } = req

  req.responseData = await dataSources.timeline.removeJobFromTimeline(user, params.id, params.jobId)

  return void next()
}

module.exports = {
  getAllTimelines,
  getTimeline,
  updateTimeline,
  createTimeline,
  deleteTimeline,
  getTimelineStats,
  addJobToTimeline,
  updateTimelineJob,
  removeJobFromTimeline
}
