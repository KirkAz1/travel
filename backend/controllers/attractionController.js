const pool = require('../config/db');

// 获取景点列表
const getAttractions = async (req, res) => {
    try {
        const { city, province, page = 1, limit = 10, keyword } = req.query;

        // 确保分页参数是合法数字，避免传 NaN / 非法值给 MySQL
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;
        const offset = (pageNum - 1) * limitNum;

        let query = 'SELECT * FROM attractions WHERE 1=1';
        const params = [];

        if (city) {
            query += ' AND city = ?';
            params.push(city);
        }

        if (province) {
            query += ' AND province = ?';
            params.push(province);
        }

        if (keyword) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            const keywordPattern = `%${keyword}%`;
            params.push(keywordPattern, keywordPattern);
        }

        // 这里直接把已经校验过的数字拼到 SQL 中，避免 LIMIT / OFFSET 作为占位符导致 MySQL 报错
        query += ` ORDER BY rating DESC, visit_count DESC LIMIT ${limitNum} OFFSET ${offset}`;

        const [attractions] = await pool.execute(query, params);

        // 获取总数
        let countQuery = 'SELECT COUNT(*) as total FROM attractions WHERE 1=1';
        const countParams = [];
        if (city) {
            countQuery += ' AND city = ?';
            countParams.push(city);
        }
        if (province) {
            countQuery += ' AND province = ?';
            countParams.push(province);
        }
        if (keyword) {
            countQuery += ' AND (name LIKE ? OR description LIKE ?)';
            const keywordPattern = `%${keyword}%`;
            countParams.push(keywordPattern, keywordPattern);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: {
                attractions,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        console.error('获取景点列表错误:', error);
        res.status(500).json({
            success: false,
            error_code: 'SERVER_ERROR',
            message: '服务器错误'
        });
    }
};

// 获取景点详情
const getAttractionById = async (req, res) => {
    try {
        const { id } = req.params;

        const [attractions] = await pool.execute(
            'SELECT * FROM attractions WHERE id = ?',
            [id]
        );

        if (attractions.length === 0) {
            return res.status(404).json({
                success: false,
                error_code: 'ATTRACTION_NOT_FOUND',
                message: '景点不存在'
            });
        }

        // 增加访问次数
        await pool.execute(
            'UPDATE attractions SET visit_count = visit_count + 1 WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            data: attractions[0]
        });
    } catch (error) {
        console.error('获取景点详情错误:', error);
        res.status(500).json({
            success: false,
            error_code: 'SERVER_ERROR',
            message: '服务器错误'
        });
    }
};

// 获取热门景点
const getPopularAttractions = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const [attractions] = await pool.execute(
            'SELECT * FROM attractions ORDER BY visit_count DESC, rating DESC LIMIT ?',
            [parseInt(limit)]
        );

        res.json({
            success: true,
            data: attractions
        });
    } catch (error) {
        console.error('获取热门景点错误:', error);
        res.status(500).json({
            success: false,
            error_code: 'SERVER_ERROR',
            message: '服务器错误'
        });
    }
};

module.exports = {
    getAttractions,
    getAttractionById,
    getPopularAttractions
};

