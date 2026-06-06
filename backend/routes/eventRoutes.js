// backend/routes/eventRoutes.js
const express = require('express')
const router = express.Router()
const { requireRole } = require('../middlewares/authMiddleware')
const {
  getAllEvents,
  getEventById,
  updateEvent,
  toggleEventLock,
  deleteEvent
} = require('../controllers/eventController')

router.get('/', requireRole('admin'), getAllEvents)
router.get('/:id', requireRole('admin'), getEventById)
router.put('/:id', requireRole('admin'), updateEvent)
router.patch('/:id/lock', requireRole('admin'), toggleEventLock)
router.delete('/:id', requireRole('admin'), deleteEvent)

module.exports = router
