const express = require('express');
const router = express.Router();
const travelNoteController = require('../controllers/travelNoteController');
const { authenticate } = require('../middlewares/auth');

// 获取游记列表（公开）
router.get('/', travelNoteController.getTravelNotes);

// 获取游记详情（公开）
router.get('/:id', travelNoteController.getTravelNoteById);

// 创建游记（需要认证）
router.post('/', authenticate, travelNoteController.createTravelNote);

// 更新游记（需要认证）
router.put('/:id', authenticate, travelNoteController.updateTravelNote);

// 删除游记（需要认证）
router.delete('/:id', authenticate, travelNoteController.deleteTravelNote);

module.exports = router;

