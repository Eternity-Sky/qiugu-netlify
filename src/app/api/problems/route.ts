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

const createProblemsTableSQL = `CREATE TABLE IF NOT EXISTS problems (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(16) NOT NULL,
  tags VARCHAR(255),
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export async function GET(req: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createProblemsTableSQL);
    // 查询题目列表
    const [rows] = await connection.execute('SELECT id, title, difficulty, tags FROM problems LIMIT 50');
    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 