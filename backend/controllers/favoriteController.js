const pool = require('../config/db');

// 获取收藏列表
const getFavorites = async (req, res) => {
  try {
    const { target_type } = req.query;
    const user_id = req.user.id;

    // 转整数
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1) limit = 20;

    // 限制最大条数，防止被恶意传大值
    const limitNum = Math.min(limit, 100) >>> 0;
    const offset = ((page - 1) * limitNum) >>> 0;

    let query = `
      SELECT 
        f.*,
        CASE 
          WHEN f.target_type = 'attraction' THEN a.name
          WHEN f.target_type = 'travel_note' THEN tn.title
        END as target_name,
        CASE 
          WHEN f.target_type = 'attraction' THEN a.image_url
          WHEN f.target_type = 'travel_note' THEN tn.cover_image
        END as target_image
      FROM favorites f
      LEFT JOIN attractions a ON f.target_type = 'attraction' AND f.target_id = a.id
      LEFT JOIN travel_notes tn ON f.target_type = 'travel_note' AND f.target_id = tn.id
      WHERE f.user_id = ?
    `;

    const params = [user_id];

    const allowedTypes = ['attraction', 'travel_note'];
    if (allowedTypes.includes(target_type)) {
      query += ' AND f.target_type = ?';
      params.push(target_type);
    }

    // 直接内联 LIMIT / OFFSET
    query += ` ORDER BY f.created_at DESC LIMIT ${offset}, ${limitNum}`;

    const [favorites] = await pool.execute(query, params);

    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('获取收藏列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};




// 添加收藏
const addFavorite = async (req, res) => {
  try {
    const { target_type, target_id } = req.body;
    const user_id = req.user.id;

    if (!target_type || !target_id) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_FIELDS',
        message: '请提供target_type和target_id'
      });
    }

    // 验证target_type
    if (!['attraction', 'travel_note'].includes(target_type)) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_TARGET_TYPE',
        message: '无效的目标类型'
      });
    }

    // 检查是否已收藏
    const [existing] = await pool.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [user_id, target_type, target_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error_code: 'ALREADY_FAVORITED',
        message: '已经收藏过了'
      });
    }

    await pool.execute(
      'INSERT INTO favorites (user_id, target_type, target_id) VALUES (?, ?, ?)',
      [user_id, target_type, target_id]
    );

    res.status(201).json({
      success: true,
      data: { message: '收藏成功' }
    });
  } catch (error) {
    console.error('添加收藏错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 取消收藏
const removeFavorite = async (req, res) => {
  try {
    const { target_type, target_id } = req.body;
    const user_id = req.user.id;

    if (!target_type || !target_id) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_FIELDS',
        message: '请提供target_type和target_id'
      });
    }

    await pool.execute(
      'DELETE FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [user_id, target_type, target_id]
    );

    res.json({
      success: true,
      data: { message: '取消收藏成功' }
    });
  } catch (error) {
    console.error('取消收藏错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 检查是否已收藏
const checkFavorite = async (req, res) => {
  try {
    const { target_type, target_id } = req.query;
    const user_id = req.user.id;

    if (!target_type || !target_id) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_PARAMS',
        message: '请提供target_type和target_id'
      });
    }

    const [favorites] = await pool.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [user_id, target_type, target_id]
    );

    res.json({
      success: true,
      data: {
        is_favorited: favorites.length > 0
      }
    });
  } catch (error) {
    console.error('检查收藏状态错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
};

