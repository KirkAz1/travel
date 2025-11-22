const pool = require('../config/db');

// 获取评论列表
const getComments = async (req, res) => {
  try {
    const { target_type, target_id } = req.query;
    let { page = 1, limit = 20 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1) limit = 20;

    // 限制最大 100 条
    const limitNum = Math.min(limit, 100) >>> 0; // 确保无符号整数
    const pageNum = (page >>> 0) || 1;
    const offset = ((pageNum - 1) * limitNum) >>> 0;

    if (!target_type || !target_id) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_PARAMS',
        message: '请提供target_type和target_id'
      });
    }

    // 日志：打印将要执行的关键参数，便于排查
    console.log('getComments params:', { target_type, target_id, pageNum, limitNum, offset, typeofOffset: typeof offset, typeofLimit: typeof limitNum });

    // 将 offset/limit 内联（已验证为整数），其他参数仍使用占位符
    const sql = `SELECT 
        c.*,
        u.username,
        u.avatar AS user_avatar,
        (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS reply_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.target_type = ? 
        AND c.target_id = ? 
        AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT ${offset}, ${limitNum}`;

    const [comments] = await pool.execute(sql, [target_type, target_id]);

    // 获取每个评论的前 5 条回复（单独查询）
    for (let comment of comments) {
      try {
        const [replies] = await pool.execute(
          `SELECT 
            c.*,
            u.username,
            u.avatar AS user_avatar
          FROM comments c
          LEFT JOIN users u ON c.user_id = u.id
          WHERE c.parent_id = ?
          ORDER BY c.created_at ASC
          LIMIT 5`,
          [comment.id]
        );
        comment.replies = replies;
      } catch (replyErr) {
        // 不要因为一个 replies 查询失败就全部终止，记录错误并继续
        console.error(`获取回复失败 commentId=${comment.id}:`, replyErr);
        comment.replies = [];
      }
    }

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('获取评论列表错误:', error);
    // 返回更有用的错误信息以便排查（注意：production 中避免泄露敏感 SQL）
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 创建评论
const createComment = async (req, res) => {
  try {
    const { target_type, target_id, content, parent_id } = req.body;
    const user_id = req.user.id;

    if (!target_type || !target_id || !content) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_FIELDS',
        message: '请填写所有必填字段'
      });
    }

    // 验证target_type
    if (!['travel_note', 'attraction'].includes(target_type)) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_TARGET_TYPE',
        message: '无效的目标类型'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO comments (user_id, target_type, target_id, content, parent_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, target_type, target_id, content, parent_id || null]
    );

    // 获取刚创建的评论
    const [comments] = await pool.execute(
      `SELECT 
        c.*,
        u.username,
        u.avatar as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: comments[0]
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 删除评论
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // 检查评论是否存在且属于当前用户
    const [comments] = await pool.execute(
      'SELECT user_id FROM comments WHERE id = ?',
      [id]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'COMMENT_NOT_FOUND',
        message: '评论不存在'
      });
    }

    if (comments[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error_code: 'FORBIDDEN',
        message: '无权删除此评论'
      });
    }

    await pool.execute('DELETE FROM comments WHERE id = ?', [id]);

    res.json({
      success: true,
      data: { message: '评论删除成功' }
    });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment
};

