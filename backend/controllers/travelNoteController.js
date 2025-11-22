const pool = require('../config/db');

// 获取游记列表
const getTravelNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, attraction_id, user_id, keyword } = req.query;
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT 
        tn.*,
        u.username,
        u.avatar as user_avatar,
        a.name as attraction_name
      FROM travel_notes tn
      LEFT JOIN users u ON tn.user_id = u.id
      LEFT JOIN attractions a ON tn.attraction_id = a.id
      WHERE tn.status = 1
    `;
    const params = [];

    if (attraction_id) {
      query += ' AND tn.attraction_id = ?';
      params.push(attraction_id);
    }

    if (user_id) {
      query += ' AND tn.user_id = ?';
      params.push(user_id);
    }

    if (keyword) {
      query += ' AND (tn.title LIKE ? OR tn.content LIKE ?)';
      const keywordPattern = `%${keyword}%`;
      params.push(keywordPattern, keywordPattern);
    }

    query += ` ORDER BY tn.created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [notes] = await pool.execute(query, params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM travel_notes WHERE status = 1';
    const countParams = [];
    if (attraction_id) {
      countQuery += ' AND attraction_id = ?';
      countParams.push(attraction_id);
    }
    if (user_id) {
      countQuery += ' AND user_id = ?';
      countParams.push(user_id);
    }
    if (keyword) {
      countQuery += ' AND (title LIKE ? OR content LIKE ?)';
      const keywordPattern = `%${keyword}%`;
      countParams.push(keywordPattern, keywordPattern);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        notes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('获取游记列表错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 获取游记详情
const getTravelNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [notes] = await pool.execute(
      `SELECT 
        tn.*,
        u.username,
        u.avatar as user_avatar,
        a.name as attraction_name,
        a.location as attraction_location
      FROM travel_notes tn
      LEFT JOIN users u ON tn.user_id = u.id
      LEFT JOIN attractions a ON tn.attraction_id = a.id
      WHERE tn.id = ? AND tn.status = 1`,
      [id]
    );

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'NOTE_NOT_FOUND',
        message: '游记不存在'
      });
    }

    // 增加浏览量
    await pool.execute(
      'UPDATE travel_notes SET views = views + 1 WHERE id = ?',
      [id]
    );

    notes[0].views += 1; // 更新返回的数据

    res.json({
      success: true,
      data: notes[0]
    });
  } catch (error) {
    console.error('获取游记详情错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 创建游记
const createTravelNote = async (req, res) => {
  try {
    const { title, content, cover_image, attraction_id, status = 1 } = req.body;
    const user_id = req.user.id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_FIELDS',
        message: '请填写标题和内容'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO travel_notes (user_id, title, content, cover_image, attraction_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, title, content, cover_image || null, attraction_id || null, status]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        message: '游记创建成功'
      }
    });
  } catch (error) {
    console.error('创建游记错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 更新游记
const updateTravelNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, cover_image, attraction_id, status } = req.body;
    const user_id = req.user.id;

    // 检查游记是否存在且属于当前用户
    const [notes] = await pool.execute(
      'SELECT user_id FROM travel_notes WHERE id = ?',
      [id]
    );

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'NOTE_NOT_FOUND',
        message: '游记不存在'
      });
    }

    if (notes[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error_code: 'FORBIDDEN',
        message: '无权修改此游记'
      });
    }

    // 构建更新语句
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }
    if (cover_image !== undefined) {
      updates.push('cover_image = ?');
      params.push(cover_image);
    }
    if (attraction_id !== undefined) {
      updates.push('attraction_id = ?');
      params.push(attraction_id);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error_code: 'NO_UPDATES',
        message: '没有要更新的字段'
      });
    }

    params.push(id);
    await pool.execute(
      `UPDATE travel_notes SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({
      success: true,
      data: { message: '游记更新成功' }
    });
  } catch (error) {
    console.error('更新游记错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

// 删除游记
const deleteTravelNote = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // 检查游记是否存在且属于当前用户
    const [notes] = await pool.execute(
      'SELECT user_id FROM travel_notes WHERE id = ?',
      [id]
    );

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'NOTE_NOT_FOUND',
        message: '游记不存在'
      });
    }

    if (notes[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error_code: 'FORBIDDEN',
        message: '无权删除此游记'
      });
    }

    await pool.execute('DELETE FROM travel_notes WHERE id = ?', [id]);

    res.json({
      success: true,
      data: { message: '游记删除成功' }
    });
  } catch (error) {
    console.error('删除游记错误:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: '服务器错误'
    });
  }
};

module.exports = {
  getTravelNotes,
  getTravelNoteById,
  createTravelNote,
  updateTravelNote,
  deleteTravelNote
};

