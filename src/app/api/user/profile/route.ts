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

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('qiugu_token');
    if (!cookie) return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    const token = cookie.value;
    const decoded = Buffer.from(token, 'base64').toString();
    const username = decoded.split(':')[0];
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute('SELECT id, username FROM user WHERE username = ?', [username]);
    await connection.end();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: users[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookie = req.cookies.get('qiugu_token');
    if (!cookie) return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    const token = cookie.value;
    const decoded = Buffer.from(token, 'base64').toString();
    const username = decoded.split(':')[0];
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, message: '原密码和新密码不能为空' }, { status: 400 });
    }
    const connection = await mysql.createConnection(dbConfig);
    // 校验原密码
    const [users] = await connection.execute('SELECT id FROM user WHERE username = ? AND password = ?', [username, oldPassword]);
    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: '原密码错误' }, { status: 403 });
    }
    // 更新密码
    await connection.execute('UPDATE user SET password = ? WHERE username = ?', [newPassword, username]);
    await connection.end();
    return NextResponse.json({ success: true, message: '密码修改成功' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 