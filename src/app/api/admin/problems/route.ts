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

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createProblemsTableSQL);
    const [rows] = await connection.execute('SELECT * FROM problems ORDER BY id DESC');
    await connection.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, tags, description } = await req.json();
    if (!title || !difficulty) {
      return NextResponse.json({ success: false, message: '标题和难度不能为空' }, { status: 400 });
    }
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createProblemsTableSQL);
    await connection.execute('INSERT INTO problems (title, difficulty, tags, description) VALUES (?, ?, ?, ?)', [title, difficulty, tags, description]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, difficulty, tags, description } = await req.json();
    if (!id || !title || !difficulty) {
      return NextResponse.json({ success: false, message: 'ID、标题和难度不能为空' }, { status: 400 });
    }
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createProblemsTableSQL);
    await connection.execute('UPDATE problems SET title=?, difficulty=?, tags=?, description=? WHERE id=?', [title, difficulty, tags, description, id]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID不能为空' }, { status: 400 });
    }
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(createProblemsTableSQL);
    await connection.execute('DELETE FROM problems WHERE id=?', [id]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 