'use strict'

const _ = require('lodash')
const { TimelineModel, JobModel, SkillModel } = require('./db')

const getAllTimelines = async (user) => {
  const timelines = await TimelineModel
    .query()
    .where('userId', user.sub)
    .withGraphFetched('jobs')
    .orderBy('name')
    .modifyGraph('jobs', builder => {
      builder.orderBy('startDate')
    })

  return {
    timelines
  }
}

const getTimeline = async (user, id) => {
  const timeline = await TimelineModel
    .query()
    .findById(id)
    .withGraphFetched('jobs')
    .modifyGraph('jobs', builder => {
      builder.orderBy('startDate')
    })

  if (timeline.userId !== user.sub) {
    // return null
    throw new Error('Timeline does not belong to user.')
  }

  return {
    ...timeline
  }
}

const updateTimeline = async (user, id, newName) => {
  console.log('user', user, 'id', id)
  const timeline = await TimelineModel
    .query()
    .patchAndFetchById(id, { name: newName })
    .withGraphFetched('jobs')
    .modifyGraph('jobs', builder => {
      builder.orderBy('startDate')
    })
    .where('userId', user.sub)
    .debug()

  console.log('timeline', timeline)

  return {
    ...timeline
  }
}

const createTimeline = async (user) => {
  const timelineNames = (await TimelineModel
    .query()
    .distinct('name'))
    .map(timeline => timeline.name.toLowerCase())

  let nameFound = false
  let newName = ''

  // loop through names until a new unique one can be created
  for (let i = 1; !nameFound; i++) {
    newName = `Plan ${i}`

    if (!timelineNames.includes(newName.toLowerCase())) {
      nameFound = true
    }
  }

  const newTimeline = await TimelineModel
    .query()
    .insertAndFetch({
      name: newName,
      userId: user.sub,
      current_preset: false // TODO this should be removed from the database
    })
    .withGraphFetched('jobs')

  return {
    ...newTimeline
  }
}

const deleteTimeline = async (user, id) => {
  console.log('id', id)
  await TimelineModel
    .query()
    .deleteById(id)
    .where('userId', user.sub)
  
  return {}
}

const getTimelineStats = async (user, id, stats = {}) => {
  const timeline = await TimelineModel
    .query()
    .findById(id)
    .where('userId', user.sub)

  // return nothing if user id doesn't match
  if (timeline.userId !==  user.sub) {
    return {}
  }
  console.log(stats)

  let distinctLocations, distinctSkillNames

  if (stats.locations) {
    if (stats.locations === 'distinctCount') {
      distinctLocations = await JobModel
        .query()
        .distinct('job.location')
        .innerJoin('job_timeline', 'job.id', 'job_timeline.jobId')
        .innerJoin('timeline', 'job_timeline.timelineId', 'timeline.id')
        .where('timeline.id', id)
    }
  }

  // map the locations to an array and filter empty strings from the array
  const mappedDistinctLocations = distinctLocations.map(item => item.location).filter(location => !!location)

  if (stats.skills) {
    if (stats.skills === 'distinctCount') {
      distinctSkillNames = await SkillModel
        .query()
        .distinct('skill.name')
        .innerJoin('job_skill', 'skill.id', 'job_skill.skillId')
        .innerJoin('job_timeline', 'job_skill.jobId', 'job_timeline.jobId')
        .where('job_timeline.timelineId', id)
    }
  }

  let result = {}

  if (distinctLocations) {
    result = { ...result, locations: mappedDistinctLocations }
  }

  if (distinctSkillNames) {
    result = { ...result, skills: distinctSkillNames }
  }

  return result
}

// pass job_timeline info as an object
const addJobToTimeline = async (user, id, { jobId, startDate, endDate }) => {
  const timeline = await TimelineModel
    .query()
    .findById(id)
  console.log('datasources', timeline)

  if (timeline.userId !== user.sub) throw new Error('Timeline does not belong to user.')
  
  const job = await JobModel
    .query()
    .findById(jobId)
  console.log('datasources job', job)

  if (job.userId !== user.sub) throw new Error('Job does not belong to user.')

  // do nothing if the timeline or job does not belong to the user
  if (!(timeline.userId === user.sub && job.userId === user.sub)) {
    return null
  }

  const addJob = await timeline
    .$relatedQuery('jobs')
    .relate({
      id: jobId,
      startDate: startDate,
      endDate: endDate
    })

  // TODO: this works, but may not be the most intuitive way
  // Try to make this by querying from the job model or
  // find a related timeline query that returns exactly what we need (or make one)
  const timelineWithJob = await TimelineModel
    .query()
    .findById(id)
    .withGraphFetched('jobs')
    .modifyGraph('jobs', builder => {
      builder.where('id', '=', jobId)
    })

  return {
    ...timelineWithJob.jobs[0]
  }
}

const updateTimelineJob = async (user, id, { jobId, startDate, endDate }) => {
  const timeline = await TimelineModel
    .query()
    .findById(id)

  if (timeline.userId !== user.sub) throw new Error('Timeline does not belong to user.')

  const job = await JobModel
  .query()
  .findById(jobId)

  if (job.userId !== user.sub) throw new Error('Job does not belong to user.')

  // do nothing if the timeline or job does not belong to the user
  if (!(timeline.userId === user.sub && job.userId === user.sub)) {
    return null
  }
  console.log('timelineId', id)
  console.log()    
  
  await timeline
    .$relatedQuery('jobs')
    .where('jobId', jobId)
    .patch({ startDate: startDate, endDate: endDate })
    .debug()

  const response = await TimelineModel
    .query()
    .findById(id)
    .withGraphFetched('jobs')
    .modifyGraph('jobs', builder => {
      builder.where('id', '=', jobId)
    })

  console.log(response)

  return response.jobs[0]
}

const removeJobFromTimeline = async (user, id, jobId) => {
  const timeline = await TimelineModel
    .query()
    .findById(id)

  if (timeline.userId !== user.sub) throw new Error('Timeline does not belong to user.')
  
  const job = await JobModel
    .query()
    .findById(jobId)

  if (job.userId !== user.sub) throw new Error('Job does not belong to user.')
    

  // do nothing if the timeline or job does not belong to the user
  if (!(timeline.userId === user.sub && job.userId === user.sub)) {
    return null
  }

  const removeJob = await timeline
    .$relatedQuery('jobs')
    .unrelate()
    .where('jobId', jobId)

  console.log(removeJob)

  return {
    removeJob
  }
}

module.exports = {
  getTimeline,
  getAllTimelines,
  updateTimeline,
  createTimeline,
  deleteTimeline,
  getTimelineStats,
  addJobToTimeline,
  updateTimelineJob,
  removeJobFromTimeline
}
