-- 旅游网站测试数据
-- 注意：用户密码都是 "123456"（已使用bcrypt加密）

-- 1. 插入用户数据
INSERT INTO users (username, email, password, avatar, bio) VALUES
('张三', 'zhangsan@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', '热爱旅行的摄影师，喜欢记录美好瞬间'),
('李四', 'lisi@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', '自由行爱好者，探索未知的风景'),
('王五', 'wangwu@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', '美食与旅行，生活两大乐趣'),
('赵六', 'zhaoliu@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu', '背包客，用脚步丈量世界'),
('孙七', 'sunqi@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi', '旅行博主，分享路上的故事');

-- 注意：上面的密码hash是示例，实际使用时请用bcrypt加密"123456"
-- 可以使用Node.js代码生成：const bcrypt = require('bcryptjs'); bcrypt.hash('123456', 10)

-- 2. 插入景点数据
INSERT INTO attractions (name, description, location, city, province, image_url, rating, visit_count, ticket_price, opening_hours) VALUES
('故宫博物院', '明清两朝的皇家宫殿，世界文化遗产，中国现存最大、最完整的古建筑群。', '北京市东城区景山前街4号', '北京', '北京市', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 4.8, 12500, 60.00, '08:30-17:00（旺季）08:30-16:30（淡季）'),
('天坛公园', '明清皇帝祭天的场所，中国古代建筑的杰作，世界文化遗产。', '北京市东城区天坛路甲1号', '北京', '北京市', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 4.6, 8900, 15.00, '06:00-21:00'),
('外滩', '上海最著名的观光景点，万国建筑博览群，黄浦江畔的璀璨明珠。', '上海市黄浦区中山东一路', '上海', '上海市', 'https://images.unsplash.com/photo-1539664030485-a936c7d29c6e?w=800', 4.7, 15200, 0.00, '全天开放'),
('东方明珠', '上海标志性建筑，登塔可俯瞰整个上海，感受魔都魅力。', '上海市浦东新区世纪大道1号', '上海', '上海市', 'https://images.unsplash.com/photo-1539664030485-a936c7d29c6e?w=800', 4.5, 11200, 180.00, '08:00-21:30'),
('西湖', '中国最著名的湖泊之一，世界文化遗产，人间天堂的美誉。', '浙江省杭州市西湖区', '杭州', '浙江省', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 4.9, 18900, 0.00, '全天开放'),
('雷峰塔', '西湖十景之一，白蛇传说的发源地，登塔可俯瞰西湖全景。', '浙江省杭州市西湖区南山路15号', '杭州', '浙江省', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 4.4, 6800, 40.00, '08:00-17:30'),
('兵马俑', '世界第八大奇迹，秦始皇陵的陪葬坑，展现古代军事艺术。', '陕西省西安市临潼区秦始皇帝陵博物院', '西安', '陕西省', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 4.8, 14500, 120.00, '08:30-18:00'),
('大雁塔', '唐代古塔，玄奘法师译经之地，西安的标志性建筑。', '陕西省西安市雁塔区雁塔路', '西安', '陕西省', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 4.5, 9200, 50.00, '08:00-17:30'),
('黄山', '中国最著名的山岳风景区，以奇松、怪石、云海、温泉著称。', '安徽省黄山市黄山区', '黄山', '安徽省', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.9, 16800, 190.00, '06:00-17:30'),
('九寨沟', '世界自然遗产，以"九寨归来不看水"闻名，人间仙境。', '四川省阿坝藏族羌族自治州九寨沟县', '九寨沟', '四川省', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.9, 13200, 220.00, '07:00-18:00'),
('张家界国家森林公园', '世界自然遗产，以奇峰异石、云海雾涛著称，电影《阿凡达》取景地。', '湖南省张家界市武陵源区', '张家界', '湖南省', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.7, 11500, 228.00, '07:00-18:00'),
('丽江古城', '世界文化遗产，纳西族文化的重要载体，小桥流水人家的诗意。', '云南省丽江市古城区', '丽江', '云南省', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.6, 14200, 50.00, '全天开放'),
('鼓浪屿', '海上花园，万国建筑博览，音乐之岛，世界文化遗产。', '福建省厦门市思明区', '厦门', '福建省', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.6, 9800, 0.00, '全天开放'),
('桂林山水', '桂林山水甲天下，漓江风光如诗如画，世界自然遗产。', '广西壮族自治区桂林市', '桂林', '广西壮族自治区', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.8, 15600, 210.00, '08:00-17:30'),
('泰山', '五岳之首，世界自然与文化双重遗产，登泰山而小天下。', '山东省泰安市泰山区', '泰安', '山东省', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 4.7, 10800, 115.00, '全天开放');

-- 3. 插入游记数据
INSERT INTO travel_notes (user_id, title, content, cover_image, attraction_id, views, likes, status) VALUES
(1, '故宫一日游：穿越明清两朝的皇家记忆', '今天终于来到了心心念念的故宫！作为中国现存最大、最完整的古建筑群，故宫的每一砖一瓦都诉说着历史的厚重。从午门进入，沿着中轴线一路向北，太和殿、中和殿、保和殿的宏伟气势让人震撼。在珍宝馆里看到了许多珍贵的文物，每一件都是历史的见证。建议早上早点来，避开人流高峰，可以更好地感受这座宫殿的魅力。', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 1, 1250, 89, 1),
(2, '西湖边的慢生活：杭州三日游', '杭州真的是一个让人慢下来的城市。在西湖边漫步，看夕阳西下，感受"欲把西湖比西子，淡妆浓抹总相宜"的意境。去了雷峰塔，登高望远，整个西湖尽收眼底。还去了灵隐寺，感受千年古刹的宁静。杭州的美食也让人印象深刻，西湖醋鱼、东坡肉、龙井虾仁，每一道都是味蕾的享受。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 5, 980, 76, 1),
(3, '上海外滩：感受魔都的繁华与历史', '外滩的夜景真的太美了！站在黄浦江边，一边是万国建筑博览群，一边是陆家嘴的现代摩天大楼，历史和现代的碰撞让人震撼。晚上7点后，外滩的灯光全部亮起，整个黄浦江畔变成了璀璨的星河。建议傍晚时分来，可以看到白天和夜晚两种不同的美。', 'https://images.unsplash.com/photo-1539664030485-a936c7d29c6e?w=800', 3, 1520, 112, 1),
(4, '兵马俑：震撼的古代军事奇迹', '终于看到了传说中的兵马俑！站在一号坑前，被眼前整齐排列的兵马俑深深震撼。每一个兵马俑的面部表情都不同，展现了古代工匠的精湛技艺。在博物馆里还看到了铜车马，工艺之精美让人叹为观止。建议请一个讲解员，可以更好地了解这段历史。', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 7, 1350, 95, 1),
(5, '黄山：云海中的仙境之旅', '黄山归来不看岳，这句话真的不假！在黄山看到了云海、奇松、怪石，每一处都是大自然的鬼斧神工。早上5点起床看日出，虽然很累，但是看到太阳从云海中升起的那一刻，一切都值得了。建议在山顶住一晚，可以看日出和日落，体验更完整。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 9, 1680, 128, 1),
(1, '九寨沟：人间仙境，水色如画', '九寨沟的美真的无法用语言形容！每一个海子都有不同的颜色，蓝得如宝石，绿得如翡翠。五花海、长海、珍珠滩瀑布，每一处都让人流连忘返。秋天的九寨沟更是美得不像话，层林尽染，五彩斑斓。建议游玩2-3天，可以慢慢欣赏每一处美景。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 10, 1420, 108, 1),
(2, '丽江古城：小桥流水人家的诗意', '丽江古城真的是一个让人忘记时间的地方。在古城里慢慢走，看小桥流水，听纳西古乐，感受慢生活的美好。晚上在四方街看篝火晚会，和当地人一起跳舞，体验不一样的民族风情。古城里的客栈也很有特色，每一家都有自己的故事。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 12, 1180, 87, 1),
(3, '张家界：阿凡达的取景地，奇峰异石的天堂', '张家界的山真的像画一样！每一座山峰都形态各异，有的像人，有的像动物，让人不得不佩服大自然的创造力。坐了百龙天梯，从山下到山上只需要几分钟，但是看到的风景却让人震撼。还走了玻璃栈道，虽然有点害怕，但是风景真的很美。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 11, 1050, 92, 1),
(4, '桂林山水：漓江上的诗与远方', '桂林山水甲天下，这句话真的名不虚传！坐船游漓江，两岸的山水如诗如画，每一处都是风景。20元人民币的背景图就在这里，亲眼看到的时候还是很激动的。还去了阳朔，西街的热闹和遇龙河的宁静形成了鲜明的对比，都很值得一去。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 14, 1320, 101, 1),
(5, '泰山：登泰山而小天下', '终于登上了五岳之首的泰山！虽然爬山很累，但是看到日出的那一刻，所有的疲惫都烟消云散了。从红门开始爬，经过中天门、南天门，最后到达玉皇顶，每一步都是对自己的挑战。建议晚上开始爬，可以在山顶看日出，体验更完整。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 15, 980, 74, 1);

-- 4. 插入评论数据
INSERT INTO comments (user_id, target_type, target_id, content, parent_id, likes) VALUES
-- 对游记的评论
(2, 'travel_note', 1, '故宫真的值得一去！我也去过，印象最深的是太和殿，太震撼了！', NULL, 5),
(3, 'travel_note', 1, '建议早点去，人少的时候拍照效果更好', NULL, 3),
(4, 'travel_note', 2, '西湖的夕阳真的很美，我也在那里拍了很多照片', NULL, 4),
(5, 'travel_note', 2, '杭州的美食确实不错，特别是西湖醋鱼，推荐！', NULL, 2),
(1, 'travel_note', 3, '外滩的夜景确实很美，我每次去上海都会去那里', NULL, 6),
(2, 'travel_note', 4, '兵马俑真的很震撼，每一个都栩栩如生', NULL, 5),
(3, 'travel_note', 5, '黄山的云海真的太美了，我也想去看看', NULL, 4),
-- 对景点的评论
(1, 'attraction', 1, '故宫是必去的景点，历史感很强，建议请个讲解员', NULL, 8),
(2, 'attraction', 5, '西湖真的很美，特别是春天和秋天，风景如画', NULL, 7),
(3, 'attraction', 3, '外滩的夜景是上海最美的风景之一，强烈推荐', NULL, 6),
(4, 'attraction', 7, '兵马俑是世界奇迹，值得专程去看', NULL, 9),
(5, 'attraction', 9, '黄山归来不看岳，这句话真的不假', NULL, 5),
-- 回复评论
(1, 'travel_note', 1, '是的，太和殿确实很震撼！', 1, 2),
(2, 'travel_note', 1, '谢谢建议，下次我也早点去', 2, 1);

-- 5. 插入收藏数据
INSERT INTO favorites (user_id, target_type, target_id) VALUES
(1, 'attraction', 1),
(1, 'attraction', 5),
(1, 'travel_note', 2),
(2, 'attraction', 3),
(2, 'attraction', 7),
(2, 'travel_note', 1),
(3, 'attraction', 9),
(3, 'travel_note', 4),
(4, 'attraction', 10),
(4, 'travel_note', 5),
(5, 'attraction', 12),
(5, 'travel_note', 3);

-- 6. 插入点赞数据
INSERT INTO likes (user_id, target_type, target_id) VALUES
-- 对游记的点赞
(2, 'travel_note', 1),
(3, 'travel_note', 1),
(4, 'travel_note', 1),
(1, 'travel_note', 2),
(3, 'travel_note', 2),
(1, 'travel_note', 3),
(2, 'travel_note', 3),
(1, 'travel_note', 4),
(2, 'travel_note', 5),
(3, 'travel_note', 5),
-- 对评论的点赞
(1, 'comment', 1),
(3, 'comment', 1),
(2, 'comment', 4),
(4, 'comment', 8);

