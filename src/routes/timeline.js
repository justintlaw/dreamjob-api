'use strict'

const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const {
  getTimeline,
  getAllTimelines,
  getTimelineStats,
  addJobToTimeline,
  updateTimelineJob,
  removeJobFromTimeline,
  updateTimeline,
  createTimeline,
  deleteTimeline
} = require('../controllers/timeline')

/**
 * Get a timeline
 */
router.get('/:id',
  asyncHandler(getTimeline),
  (req, res) => res.json(req.responseData)
)

/**
 * Get all timelines
 */
router.get('/',
  asyncHandler(getAllTimelines),
  (req, res) => res.json(req.responseData)
)

/**
 * Update a timeline
 */
router.post('/:id',
  asyncHandler(updateTimeline),
  (req, res) => res.json(req.responseData)
)

/**
 * Create a timeline
 */
router.post('/',
  asyncHandler(createTimeline),
  (req, res) => res.json(req.responseData)
)

/**
 * Delete a timeline
 */
router.delete('/:id',
  asyncHandler(deleteTimeline),
  (req, res) => res.json(req.responseData)
)

/**
 * Add a job to a timeline
 */
router.post('/:id/job',
  asyncHandler(addJobToTimeline),
  (req, res) => res.json(req.responseData)
)

/**
 * Update a job in a timeline
 */
router.post('/:id/job/:jobId',
  asyncHandler(updateTimelineJob),
  (req, res) => res.json(req.responseData)
)

/**
 * Get stats for a timeline
 */
router.post('/:id/stats',
  asyncHandler(getTimelineStats),
  (req, res) => res.json(req.responseData)
)

/**
 * Update a timeline
 */
// router.post('/:id',
//   asyncHandler(updateTimeline),
//   (req, res) => res.json(req.responseData)
// )

/**
 * Create a timeline
 */
//  router.post('/',
//  asyncHandler(createTimeline),
//  (req, res) => res.json(req.responseData)
// )

/**
 * Delete a timeline
 */
//  router.delete('/:id',
//  asyncHandler(deleteTimeline),
//  (req, res) => res.json(req.responseData)
// )

// /**
//  * Get a job in a timeline
//  */
//  router.get('/:id/job/:jobId',
//  asyncHandler(getTimelineJob),
//  (req, res) => res.json(req.responseData)
// )

/**
 * Add a job to a timeline
 */
router.post('/:id/job/:jobId',
  asyncHandler(addJobToTimeline),
  (req, res) => res.json(req.responseData)
)

/**
 * Update a job in the timeline
 */
//  router.post('/:id/job/:jobId',
//  asyncHandler(updateTimelineJob),
//  (req, res) => res.json(req.responseData)
// )

/**
 * Remove a job from a timeline
 */
 router.delete('/:id/job/:jobId',
 asyncHandler(removeJobFromTimeline),
 (req, res) => res.json(req.responseData)
)

module.exports = router
