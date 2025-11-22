const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middlewares/auth');

// 所有路由都需要认证
router.use(authenticate);

// 点赞/取消点赞
router.post('/toggle', likeController.toggleLike);

// 检查是否已点赞
router.get('/check', likeController.checkLike);

module.exports = router;

