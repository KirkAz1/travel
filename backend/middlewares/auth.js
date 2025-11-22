const jwt = require('jsonwebtoken');

// JWT认证中间件
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({
                success: false,
                error_code: 'NO_TOKEN',
                message: '未提供认证令牌'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded; // 将用户信息添加到请求对象
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error_code: 'INVALID_TOKEN',
            message: '令牌无效或已过期'
        });
    }
};

module.exports = { authenticate };

