'use strict'

const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const { getAllJobs, getJob } = require('../controllers/jobs')

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
