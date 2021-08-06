/**
 * TODO
 *  Add way to handle duplicate entries with different spellings/case
 *  Use modifiers more, especially in the database models themselves
 *  When filtering by skills, only the filtered skill will be included, not related ones
 *  Add something to always filter by userId by default, or write something to do it
 * 
 *  userId -> user_id
 */

'use strict'

const _ = require('lodash')

const { JobModel, SkillModel, UserModel } = require('./db')

const getAllJobs = async (user, filter = {}) => {
  console.log(filter)
  // manually build filter for now
  if (!_.isEmpty(filter)) {
    // use with graph joined so we can filter on relations too
    const query = JobModel.query().withGraphJoined('skills').where('job.userId', user.sub)

    // filter location
    if (filter.location) {
      query.whereIn('location', filter.location)
    }

    // filter salary
    if (filter.salaryRange) {
      query.whereBetween('salary', filter.salaryRange)
    }

    // filter job type
    if (filter.jobType) {
      query.where('type', filter.jobType)
    }

    // filter intern
    if (filter.is_intern) {
      const isIntern = filter.is_intern === 'true' ? true : false
      query.where('is_intern', isIntern)
    }

    // filter skills
    if (filter.skills) {
      // You thought you wouldn't be doing subqueries tonight didn't you?
      query.whereIn(
        'job.id',
        JobModel.query()
          .joinRelated('skills')
          .select('job.id')
          // distinct doesn't seem to be working here, but because
          // it is a whereIn of ids, results should still be accurate
          .distinct()
          .whereIn('skills.name', filter.skills)
      )
    }

    const jobs = await Promise.resolve(query)

    console.log(jobs)

    return {
      jobs
    }
  }

  const jobs = await JobModel
    .query()
    .withGraphFetched('skills')
    .where('job.userId', user.sub)

  return {
    jobs
  }
}

const getJob = async (user, id) => {
  const job = await JobModel
    .query()
    .findById(id)
    .withGraphFetched('skills')

  // return nothing if it's not one of the user's jobs
  return user.sub === job.userId ? { ...job } : null

  // return {
  //   ...job
  // }
}

const updateJob = async (user, id, newJob) => {
  const job = await JobModel
    .query()
    .findById(id)
    .withGraphFetched('skills')

  // return null if the job doesn't belong to the user
  if (job.userId !== user.sub) {
    return null
  }

  console.log(newJob)

  // a list of new skills (skills that have no id)
  const newSkills = newJob.skills
    .filter(skill => !(!!skill.id))
  console.log('new skills', newSkills)

  // already existing ids to keep
  const keepSkillIds = newJob.skills
    .filter(skill => !!skill.id)
    .map(skill => skill.id)
  console.log('keep skills', keepSkillIds)

  // ids no longer included to remove
  const skillIdsToRemove = job.skills
    .filter(skill => !(keepSkillIds.includes(skill.id)))
    .map(s => s.id)
  console.log('remove ids', skillIdsToRemove)

  if (skillIdsToRemove) {
    const removeSkills = await job
    .$relatedQuery('skills')
    .unrelate()
    .whereIn('id', skillIdsToRemove)
  }

  // relate each new skill to the job
  for (let skill of newSkills) {
    const query = await JobModel.query().findById(id)
    console.log('skill', skill)
    
    // create new skill or relate an existing
    const existingSkill = await SkillModel.query().findOne({
      name: skill.name
    })
    // console.log('skills', skillQuery)

    if (existingSkill) {
      await query.$relatedQuery('skills').relate(existingSkill)
    } else {
      await query.$relatedQuery('skills').insert(skill)
    }

    // console.log('relate result', result)
  }


  // update the job 
  const updatedJob = await JobModel
    .query()
    .findById(id)
    .patch(newJob)
    .withGraphFetched('skills')

  // get the updated job
  const finalJob = await JobModel
    .query()
    .findById(id)
    .withGraphFetched('skills')

  return {
    ...finalJob
  }
}

// Please clean me
const createJob = async (user, newJob) => {
  console.log('creating job')
  // TODO: decide whether or not to allow duplicate skills in the database
  // TODO: check if insertGraph checks for skill duplicates

  // return null if there is no user
  if (!user.sub) {
    return null // should throw an error instead
  }

  newJob.userId = user.sub

  console.log(newJob)

  // add ids to skills that already exist
  const existingsSkillIds = []
  const newJobSkills = []
  console.log('before loop')
  for (let i = 0; i < newJob.skills.length; i++) {
    console.log('in loop')
    const existingSkill = await SkillModel
      .query()
      .findOne({
        name: newJob.skills[i].name
      })

    if (existingSkill) {
      existingsSkillIds.push(existingSkill.id)
    } else {
      newJobSkills.push(newJob.skills[i])
    }
  }

  console.log(existingsSkillIds)
  console.log(newJobSkills)

  newJob.skills = newJobSkills

  // we need to check for skill ids here
  // we can only insert graph for jobs that don't use existing skills
  console.log(newJob)
  const job = await JobModel
    .query()
    .insertGraph(newJob)

  console.log('job', job)

  // relate any existing skills
  console.log('job id', job.id)

  for (let jobId of existingsSkillIds) {
    await JobModel
      .relatedQuery('skills')
      .for(job.id)
      .relate(jobId)
      .debug()
  }

  // no need to use objection ro relate because its done manually
  // relate the job to the user id
  // const userData = await UserModel
  //   .query()
  //   .findById(user.sub)

  // await JobModel
  //   .relatedQuery('user')
  //   .for(job.id)
  //   .relate(userData)

  const finalJob = await JobModel
    .query()
    .findById(job.id)
    .withGraphFetched('skills')

  return {
    ...finalJob
  }
}

const deleteJob = async (user, id) => {
  const jobToDelete = await JobModel
    .query()
    .findById(id)

  // do nothing if the job does not belong to the user
  if (jobToDelete.userId !== user.sub) {
    return {}
  }

  const job = await JobModel
    .query()
    .deleteById(id)

  console.log(job)

  return {}
}

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  createJob,
  deleteJob
}
