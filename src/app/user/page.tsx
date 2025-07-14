"use client";
import React from "react";
import { Card, Typography, Row, Col } from "antd";
const { Title, Paragraph } = Typography;

const links = [
  { title: "历史提交", desc: "查看你的所有提交记录", href: "/user/history" },
  { title: "个人信息", desc: "管理你的账号信息", href: "/user/profile" },
  { title: "排行榜", desc: "查看全站用户排名", href: "/rank" },
];

export default function UserPage() {
  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={2}>用户中心</Title>
      <Paragraph>欢迎来到用户中心，你可以在这里管理账号、查看历史提交、浏览排行榜等。</Paragraph>
      <Row gutter={24} style={{ marginTop: 32 }}>
        {links.map(link => (
          <Col xs={24} sm={12} md={8} key={link.href} style={{ marginBottom: 24 }}>
            <a href={link.href} style={{ textDecoration: 'none' }}>
              <Card hoverable style={{ borderRadius: 10, minHeight: 120 }}>
                <Title level={4}>{link.title}</Title>
                <Paragraph type="secondary">{link.desc}</Paragraph>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
} 