const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middlewares/auth');

// 所有路由都需要认证
router.use(authenticate);

// 获取收藏列表
router.get('/', favoriteController.getFavorites);

// 检查是否已收藏
router.get('/check', favoriteController.checkFavorite);

// 添加收藏
router.post('/', favoriteController.addFavorite);

// 取消收藏
router.delete('/', favoriteController.removeFavorite);

module.exports = router;

