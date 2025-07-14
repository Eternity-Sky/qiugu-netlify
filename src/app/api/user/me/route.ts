import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('qiugu_token');
    if (!cookie) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }
    const token = cookie.value;
    const decoded = Buffer.from(token, 'base64').toString();
    const username = decoded.split(':')[0];
    return NextResponse.json({ success: true, data: { username } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 