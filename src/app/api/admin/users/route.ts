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
    // 检查是否有admin账号
    const [admins] = await connection.execute('SELECT id FROM user WHERE username = ? LIMIT 1', ['admin']);
    if (Array.isArray(admins) && admins.length === 0) {
      await connection.execute('INSERT INTO user (username, password, admin) VALUES (?, ?, 1)', ['admin', 'admin']);
    }
    const [rows] = await connection.execute('SELECT id, username, solved, admin FROM user ORDER BY id ASC');
    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 