'use strict'

const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const { getAllSkills, getSkill, createSkill, updateSkill, deleteSkill } = require('../controllers/skill')

/**
 * Get all skills
 */
router.get('/',
  asyncHandler(getAllSkills),
  (req, res) => res.json(req.responseData)
)

/**
 * Get skill by id
 */
router.get('/:id',
  asyncHandler(getSkill),
  (req, res) => res.json(req.responseData)
)

/**
 * Edit skill
 */
router.post('/:id',
 asyncHandler(updateSkill),
 (req, res) => res.json(req.responseData)
)

/**
 * Create a skill
 */
router.post('/',
  asyncHandler(createSkill),
  (req, res) => res.json(req.responseData)
)

/**
 * Delete a skill
 */
router.delete('/:id',
  asyncHandler(deleteSkill),

  (req, res) => res.json(req.responseData)
)

module.exports = router
