const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const { getAllUsers, getUser, createUser, addSkillToUser, removeSkillFromUser } = require('../controllers/user')

/**
 * Get all users
 */
router.get('/',
  asyncHandler(getAllUsers),
  (req, res) => res.json(req.responseData)
)

/**
 * Get user by id
 */
router.get('/:id',
  asyncHandler(getUser),
  (req, res) => res.json(req.responseData)
)

/**
 * Create user
 */
router.post('/',
  asyncHandler(createUser),
  (req, res) => res.json(req.responseData)
)

/**
 * Update a user (for now just adding skills)
 */
router.post('/:id',
  asyncHandler(addSkillToUser),
  (req, res) => res.json(req.responseData)
)

/**
 * Remove skill from a user
 */
router.post('/:id/removeSkill',
  asyncHandler(removeSkillFromUser),
  (req, res) => res.json(req.responseData)
)

module.exports = router
