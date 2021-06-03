'use strict'

const getAllJobs = async () => {
  return {
    user: 'test_job_1',
    user2: 'tesst_job_2'
  }
}

const getJob = async (id) => {
  return {
    user: `test_job_${id}`
  }
}

module.exports = {
  getAllJobs,
  getJob
}
