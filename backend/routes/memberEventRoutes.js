// backend/routes/memberEventRoutes.js
const express   = require('express')
const router    = express.Router()
const { authMiddleware } = require('../middlewares/authMiddleware')
const upload    = require('../middlewares/uploadMiddleware')
const {
  getMyEvents, getMyEvent, createMyEvent, updateMyEvent, deleteMyEvent
} = require('../controllers/memberEventController')
const { uploadEventFile, deleteEventFile } = require('../controllers/fileController')

router.get('/',              authMiddleware, getMyEvents)
router.get('/:id',           authMiddleware, getMyEvent)
router.post('/',             authMiddleware, createMyEvent)
router.put('/:id',           authMiddleware, updateMyEvent)
router.delete('/:id',        authMiddleware, deleteMyEvent)

router.post('/:id/files',    authMiddleware, upload.single('file'), uploadEventFile)
router.delete('/:id/files/:fileId', authMiddleware, deleteEventFile)

module.exports = router
