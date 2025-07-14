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
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createSubmissionTableSQL);
    const [rows] = await connection.execute('SELECT id, user_id, problem_id, status, language, submit_time FROM submission ORDER BY id DESC LIMIT 200');
    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 