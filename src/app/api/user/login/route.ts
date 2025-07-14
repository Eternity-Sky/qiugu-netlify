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

const createUserTableSQL = `CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, message: '用户名和密码不能为空' }, { status: 400 });
    }
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createUserTableSQL);
    const [rows] = await connection.execute('SELECT id, admin FROM user WHERE username = ? AND password = ?', [username, password]);
    await connection.end();
    const userRows = rows as any[];
    if (Array.isArray(userRows) && userRows.length > 0) {
      // 生成简单token
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      const res = NextResponse.json({ success: true, admin: userRows[0].admin === 1 });
      res.cookies.set('qiugu_token', token, { httpOnly: true, path: '/', maxAge: 7 * 24 * 3600 });
      return res;
    } else {
      return NextResponse.json({ success: false, message: '用户名或密码错误' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 