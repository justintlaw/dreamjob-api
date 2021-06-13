'use strict'

const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const { getAllJobs, getJob, updateJob, createJob, deleteJob } = require('../controllers/jobs')

/**
 * Get all jobs
 */
router.get('/',
  asyncHandler(getAllJobs),
  (req, res) => res.json(req.responseData)
)

/** 
 * Get a job 
 */
router.get('/:id',
  asyncHandler(getJob),
  (req, res) => res.json(req.responseData)
)

/**
 * Edit a job
 */
router.post('/:id',
  asyncHandler(updateJob),
  (req, res) => res.json(req.responseData)
)

/**
 * Create a job
 */
router.post('/',
  asyncHandler(createJob),
  (req, res) => res.json(req.responseData)
)

/**
 * Delete a job
 */
router.delete('/:id',
  asyncHandler(deleteJob),
  (req, res) => res.json(req.responseData)
)

module.exports = router
