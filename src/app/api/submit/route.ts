import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { problemId, language, code } = await req.json();
    // 这里返回假评测结果，后续可对接判题服务
    if (!problemId || !language || !code) {
      return NextResponse.json({ success: false, message: '参数不完整' }, { status: 400 });
    }
    // 假设只要代码长度大于10就通过
    const accepted = code.length > 10;
    return NextResponse.json({
      success: true,
      result: {
        status: accepted ? 'Accepted' : 'Wrong Answer',
        detail: accepted ? '恭喜，代码通过所有测试点！' : '代码未通过，请检查逻辑或格式。',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 