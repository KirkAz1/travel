const pool = require('../config/db');

// 点赞/取消点赞
const toggleLike = async (req, res) => {
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
    if (!['travel_note', 'comment'].includes(target_type)) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_TARGET_TYPE',
        message: '无效的目标类型'
      });
    }

    // 检查是否已点赞
    const [existing] = await pool.execute(
      'SELECT id FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [user_id, target_type, target_id]
    );

    if (existing.length > 0) {
      // 取消点赞
      await pool.execute(
        'DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?',
        [user_id, target_type, target_id]
      );

      // 更新点赞数
      if (target_type === 'travel_note') {
        await pool.execute(
          'UPDATE travel_notes SET likes = GREATEST(likes - 1, 0) WHERE id = ?',
          [target_id]
        );
      } else if (target_type === 'comment') {
        await pool.execute(
          'UPDATE comments SET likes = GREATEST(likes - 1, 0) WHERE id = ?',
          [target_id]
        );
      }

      res.json({
        success: true,
        data: { is_liked: false, message: '取消点赞成功' }
      });
    } else {
      // 添加点赞
      await pool.execute(
        'INSERT INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)',
        [user_id, target_type, target_id]
      );

      // 更新点赞数
      if (target_type === 'travel_note') {
        await pool.execute(
          'UPDATE travel_notes SET likes = likes + 1 WHERE id = ?',
          [target_id]
        );
      } else if (target_type === 'comment') {
        await pool.execute(
          'UPDATE comments SET likes = likes + 1 WHERE id = ?',
          [target_id]
        );
      }

      res.json({
        success: true,
        data: { is_liked: true, message: '点赞成功' }
      });
    }
  } catch (error) {
    console.error('点赞操作错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 检查是否已点赞
const checkLike = async (req, res) => {
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

    const [likes] = await pool.execute(
      'SELECT id FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [user_id, target_type, target_id]
    );

    res.json({
      success: true,
      data: {
        is_liked: likes.length > 0
      }
    });
  } catch (error) {
    console.error('检查点赞状态错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

module.exports = {
  toggleLike,
  checkLike
};

