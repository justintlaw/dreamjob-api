'use strict'

const express = require('express')
const router = express.Router()

const user = require('./user')
const jobs = require('./jobs')
const skill = require('./skill')
const timeline = require('./timeline')

router.use('/users', user)
router.use('/jobs', jobs)
router.use('/skills', skill)
router.use('/timeline', timeline)

module.exports = router
