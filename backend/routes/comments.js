const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/auth');

// 获取评论列表（公开）
router.get('/', commentController.getComments);

// 创建评论（需要认证）
router.post('/', authenticate, commentController.createComment);

// 删除评论（需要认证）
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;

