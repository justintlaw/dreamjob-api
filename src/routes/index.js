'use strict'

const express = require('express')
const router = express.Router()

const user = require('./user')
const jobs = require('./jobs')
const skill = require('./skill')

router.use('/users', user)
router.use('/jobs', jobs)
router.use('/skills', skill)

module.exports = router
