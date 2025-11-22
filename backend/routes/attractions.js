const express = require('express');
const router = express.Router();
const attractionController = require('../controllers/attractionController');

// 获取景点列表
router.get('/', attractionController.getAttractions);

// 获取热门景点
router.get('/popular', attractionController.getPopularAttractions);

// 获取景点详情
router.get('/:id', attractionController.getAttractionById);

module.exports = router;

