const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 用户注册
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 验证输入
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error_code: 'MISSING_FIELDS',
                message: '请填写所有必填字段'
            });
        }

        // 检查用户名是否已存在
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                error_code: 'USER_EXISTS',
                message: '用户名或邮箱已存在'
            });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // 生成JWT token
        const token = jwt.sign(
            { id: result.insertId, username, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: result.insertId,
                    username,
                    email
                }
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            success: false,
            error_code: 'SERVER_ERROR',
            message: '服务器错误'
        });
    }
};

// 用户登录
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error_code: 'MISSING_FIELDS',
                message: '请填写用户名和密码'
            });
        }

        // 查找用户
        const [users] = await pool.execute(
            'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error_code: 'INVALID_CREDENTIALS',
                message: '用户名或密码错误'
            });
        }

        const user = users[0];

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error_code: 'INVALID_CREDENTIALS',
                message: '用户名或密码错误'
            });
        }

        // 生成JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({
            success: false,
            error_code: 'SERVER_ERROR',
            message: '服务器错误'
        });
    }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, username, email, avatar, bio, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error_code: 'USER_NOT_FOUND',
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({
            success: false,
            error_code: 'SERVER_ERROR',
            message: '服务器错误'
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};

