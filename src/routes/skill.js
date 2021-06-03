'use strict'

const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const { getAllSkills, getSkill } = require('../controllers/skill')

/**
 * Get all users
 */
router.get('/',
  asyncHandler(getAllSkills),
  (req, res) => res.json(req.responseData)
)

/**
 * Get user by id
 */
router.get('/:id',
  asyncHandler(getSkill),
  (req, res) => res.json(req.responseData)
)

module.exports = router
