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
const createUserTableSQL = `CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  solved INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
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
    await connection.execute(createProblemsTableSQL);
    await connection.execute(createUserTableSQL);
    await connection.execute(createSubmissionTableSQL);
    const [[{ problems }]] = (await connection.execute('SELECT COUNT(*) as problems FROM problems') as any);
    const [[{ users }]] = (await connection.execute('SELECT COUNT(*) as users FROM user') as any);
    const [[{ submissions }]] = (await connection.execute('SELECT COUNT(*) as submissions FROM submission') as any);
    await connection.end();
    return NextResponse.json({ success: true, data: { problems, users, submissions } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 