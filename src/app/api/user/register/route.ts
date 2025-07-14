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
    // 检查用户名是否已存在
    const [rows] = await connection.execute('SELECT id FROM user WHERE username = ?', [username]);
    if (Array.isArray(rows) && rows.length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: '用户名已存在' }, { status: 409 });
    }
    // 插入新用户
    await connection.execute('INSERT INTO user (username, password) VALUES (?, ?)', [username, password]);
    // 检查solved字段是否存在
    const [columns] = await connection.execute("SHOW COLUMNS FROM user LIKE 'solved'");
    if ((columns as any[]).length === 0) {
      await connection.execute("ALTER TABLE user ADD COLUMN solved INT DEFAULT 0");
    }
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 