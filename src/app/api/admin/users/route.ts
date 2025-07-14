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
  password VARCHAR(128) NOT NULL,
  solved INT DEFAULT 0,
  admin TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export async function GET(req: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createUserTableSQL);
    // 检查solved字段
    const [columns] = await connection.execute("SHOW COLUMNS FROM user LIKE 'solved'");
    if ((columns as any[]).length === 0) {
      await connection.execute("ALTER TABLE user ADD COLUMN solved INT DEFAULT 0");
    }
    // 检查admin字段
    const [adminCol] = await connection.execute("SHOW COLUMNS FROM user LIKE 'admin'");
    if ((adminCol as any[]).length === 0) {
      await connection.execute("ALTER TABLE user ADD COLUMN admin TINYINT(1) DEFAULT 0");
    }
    // 不再自动插入admin账号
    const [rows] = await connection.execute('SELECT id, username, solved, admin FROM user ORDER BY id ASC');
    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ success: false, message: '用户名不能为空' }, { status: 400 });
    }
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createUserTableSQL);
    await connection.execute('DELETE FROM user WHERE username = ?', [username]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 