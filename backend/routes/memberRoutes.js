// backend/routes/memberRoutes.js
const express = require('express')
const router = express.Router()
const { requireRole } = require('../middlewares/authMiddleware')
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  updateMemberStatus,
  resetMemberPassword,
  deleteMember
} = require('../controllers/memberController')

router.get('/', requireRole('admin'), getAllMembers)
router.get('/:id', requireRole('admin'), getMemberById)
router.post('/', requireRole('admin'), createMember)
router.put('/:id', requireRole('admin'), updateMember)
router.patch('/:id/status', requireRole('admin'), updateMemberStatus)
router.patch('/:id/reset-password', requireRole('admin'), resetMemberPassword)
router.delete('/:id', requireRole('admin'), deleteMember)

module.exports = router
