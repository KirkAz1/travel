const jwt = require('jsonwebtoken');

// JWT认证中间件
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);

        const token = authHeader?.split(' ')[1]; // Bearer <token>
        console.log('Extracted token:', token);

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                success: false,
                error_code: 'NO_TOKEN',
                message: '未提供认证令牌'
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        console.log('JWT secret used for verification:', jwtSecret ? '已配置' : '未配置');

        const decoded = jwt.verify(token, jwtSecret);
        console.log('Token decoded successfully:', decoded);

        req.user = decoded; // 将用户信息添加到请求对象
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        console.error('JWT secret:', process.env.JWT_SECRET);
        return res.status(401).json({
            success: false,
            error_code: 'INVALID_TOKEN',
            message: '令牌无效或已过期'
        });
    }
};

module.exports = { authenticate };

