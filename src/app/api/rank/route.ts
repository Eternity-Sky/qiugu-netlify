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
  solved INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export async function GET(req: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createUserTableSQL);
    // 检查solved字段是否存在
    const [columns] = await connection.execute("SHOW COLUMNS FROM user LIKE 'solved'");
    if ((columns as any[]).length === 0) {
      await connection.execute("ALTER TABLE user ADD COLUMN solved INT DEFAULT 0");
    }
    // 按solved降序取前100
    const [rows] = await connection.execute('SELECT username, solved FROM user ORDER BY solved DESC, id ASC LIMIT 100');
    await connection.end();
    // 加上排名
    const data = (rows as any[]).map((row: any, idx: number) => ({ rank: idx + 1, user: row.username, solved: row.solved }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 