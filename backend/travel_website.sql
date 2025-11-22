-- 旅游网站数据库设计
-- 创建数据库（如果需要）
-- CREATE DATABASE IF NOT EXISTS travel_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE travel_website;

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密后）',
    avatar VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    bio TEXT DEFAULT NULL COMMENT '个人简介',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 景点表
CREATE TABLE IF NOT EXISTS attractions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL COMMENT '景点名称',
    description TEXT COMMENT '景点描述',
    location VARCHAR(200) COMMENT '地理位置',
    city VARCHAR(100) COMMENT '所在城市',
    province VARCHAR(100) COMMENT '所在省份',
    image_url VARCHAR(500) DEFAULT NULL COMMENT '景点图片URL',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分（0-5）',
    visit_count INT DEFAULT 0 COMMENT '访问次数',
    ticket_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '门票价格',
    opening_hours VARCHAR(200) DEFAULT NULL COMMENT '开放时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_city (city),
    INDEX idx_province (province),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景点表';

-- 3. 游记表
CREATE TABLE IF NOT EXISTS travel_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '作者ID',
    title VARCHAR(200) NOT NULL COMMENT '游记标题',
    content TEXT NOT NULL COMMENT '游记内容',
    cover_image VARCHAR(500) DEFAULT NULL COMMENT '封面图片',
    attraction_id INT DEFAULT NULL COMMENT '关联景点ID',
    views INT DEFAULT 0 COMMENT '浏览量',
    likes INT DEFAULT 0 COMMENT '点赞数',
    status TINYINT DEFAULT 1 COMMENT '状态：1-已发布，0-草稿',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_attraction_id (attraction_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游记表';

-- 4. 评论表
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '评论用户ID',
    target_type ENUM('travel_note', 'attraction') NOT NULL COMMENT '评论目标类型',
    target_id INT NOT NULL COMMENT '评论目标ID',
    content TEXT NOT NULL COMMENT '评论内容',
    parent_id INT DEFAULT NULL COMMENT '父评论ID（用于回复）',
    likes INT DEFAULT 0 COMMENT '点赞数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 5. 收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    target_type ENUM('attraction', 'travel_note') NOT NULL COMMENT '收藏类型',
    target_id INT NOT NULL COMMENT '收藏目标ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- 6. 点赞表（用于游记和评论的点赞）
CREATE TABLE IF NOT EXISTS likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    target_type ENUM('travel_note', 'comment') NOT NULL COMMENT '点赞类型',
    target_id INT NOT NULL COMMENT '点赞目标ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

