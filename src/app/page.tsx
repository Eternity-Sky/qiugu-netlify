"use client";
import React from "react";
import { Button, Typography } from "antd";
const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      padding: '0 16px'
    }}>
      <div style={{
        maxWidth: 700,
        background: '#fff',
        padding: 48,
        borderRadius: 18,
        boxShadow: '0 4px 24px #dbeafe55',
        textAlign: 'center',
        marginTop: 48
      }}>
        <Title level={1} style={{ fontWeight: 800, fontSize: 48, color: '#2563eb', marginBottom: 16, letterSpacing: 2 }}>秋谷 OJ</Title>
        <Paragraph style={{ fontSize: 20, color: '#555', marginBottom: 32 }}>
          秋谷 OJ 是一个专注于算法竞赛与编程练习的在线评测平台，致力于为广大编程爱好者提供优质的刷题与竞赛体验。
        </Paragraph>
        <Button type="primary" size="large" href="/problems" style={{ fontSize: 20, padding: '0 48px', height: 56, borderRadius: 8 }}>
          进入题库
        </Button>
      </div>
    </div>
  );
}
