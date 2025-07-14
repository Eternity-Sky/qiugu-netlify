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

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createProblemsTableSQL);
    const [rows] = await connection.execute('SELECT id, title, difficulty, tags, description FROM problems WHERE id = ?', [id]);
    await connection.end();
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows[0] });
    } else {
      return NextResponse.json({ success: false, message: '题目不存在' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 