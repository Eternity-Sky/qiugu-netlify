import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
};

const createSubmissionTableSQL = `CREATE TABLE IF NOT EXISTS submission (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  problem_id INT NOT NULL,
  status VARCHAR(32) NOT NULL,
  language VARCHAR(32) NOT NULL,
  submit_time DATETIME NOT NULL,
  code TEXT,
  INDEX(user_id),
  INDEX(problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('qiugu_token');
    if (!cookie) return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    const token = cookie.value;
    const decoded = Buffer.from(token, 'base64').toString();
    const username = decoded.split(':')[0];
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createSubmissionTableSQL);
    // 获取用户id
    const [users] = await connection.execute('SELECT id FROM user WHERE username = ?', [username]);
    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }
    const userId = (users as any)[0].id;
    // 查询提交记录
    const [rows] = await connection.execute(
      'SELECT s.id, p.title as problem, s.status, s.language, s.submit_time FROM submission s JOIN problems p ON s.problem_id = p.id WHERE s.user_id = ? ORDER BY s.id DESC LIMIT 100',
      [userId]
    );
    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 