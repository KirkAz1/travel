// 生成密码hash的脚本
// 运行: node generate_password_hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);
  console.log('密码 "123456" 的bcrypt hash值:');
  console.log(hash);
  console.log('\n请将上面的hash值替换到 insert_sample_data.sql 文件中的用户密码字段');
}

generateHash();

