'use strict'

const { JobModel } = require('./db')

const getAllJobs = async () => {
  const jobs = await JobModel
    .query()

  return {
    jobs
  }
}

const getJob = async (id) => {
  const job = await JobModel
    .query()
    .findById(id)

  return {
    ...job
  }
}

const updateJob = async (id, newJob) => {
  const job = await JobModel
    .query()
    .findById(id)
    .patch(newJob)

    console.log(job)

  return {
    ...job
  }
}

const createJob = async (newJob) => {
  const job = await JobModel
    .query()
    .insert(newJob)

  return {
    ...job
  }
}

const deleteJob = async (id) => {
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
