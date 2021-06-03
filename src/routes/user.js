const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const { getAllUsers, getUser } = require('../controllers/user')

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

module.exports = router
