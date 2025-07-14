"use client";
import React from "react";
import { Card, Typography, Row, Col } from "antd";
const { Title, Paragraph } = Typography;

const links = [
  { title: "题目管理", desc: "增删改查题目，导入导出题库", href: "/admin/problems" },
  { title: "用户管理", desc: "管理用户账号与权限", href: "/admin/users" },
  { title: "评测管理", desc: "查看与管理所有提交与评测", href: "/admin/submissions" },
  { title: "系统统计", desc: "平台数据统计与分析", href: "/admin/stats" },
];

export default function AdminPage() {
  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={2}>后台管理</Title>
      <Paragraph>欢迎进入秋谷OJ后台管理系统，请选择需要管理的功能模块。</Paragraph>
      <Row gutter={24} style={{ marginTop: 32 }}>
        {links.map(link => (
          <Col xs={24} sm={12} md={12} key={link.href} style={{ marginBottom: 24 }}>
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