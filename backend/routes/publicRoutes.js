// backend/routes/publicRoutes.js
const express = require('express')
const router  = express.Router()
const {
  getPublishedEvents, getPublishedEventById, getExecom, submitContactMessage
} = require('../controllers/publicController')

router.get('/events',      getPublishedEvents)
router.get('/events/:id',  getPublishedEventById)
router.get('/execom',      getExecom)
router.post('/contact',    submitContactMessage)

module.exports = router
