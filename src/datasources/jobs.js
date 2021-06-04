'use strict'

const { db } = require('./db')

const getAllJobs = async () => {
  const jobs = await db.JobModel
    .query()

  return {
    jobs
  }
}

const getJob = async (id) => {
  const job = await db.JobModel
    .query()
    .findById(id)

  return {
    job: job
  }
}

module.exports = {
  getAllJobs,
  getJob
}
